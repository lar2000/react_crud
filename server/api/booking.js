const express = require('express');
const db = require('./db_connection');
const router = express.Router();

// Handle booking creation (without profile upload)
router.post('/create', function (req, res) {
  const {_id, cust_id_fk, service_id_fk, group_type, date, time, group_size, tell, email } = req.body;
  const table = 'booking';
  
  // Auto-generate booking ID if it doesn't exist
  if (!_id) {
    db.autoId(table, 'id', (err, id) => {
      const code = id.toString().slice(-4).padStart(4, '0');
      const bookId = 'B-' + code;
      const fields = 'id, book_id, cust_id_fk, service_id_fk, group_type, date, time, group_size, tell, email, state';
      const dataValue = [id, bookId, cust_id_fk, service_id_fk, group_type, date, time, group_size, tell, email, 1]; // Default state to 1 (active)

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting booking:', err);
          return res.status(500).json({ error: 'Failed to add booking.' });
        }
        console.log('booking added successfully!');
        return res.status(200).json({ message: 'booking added successfully.', booking: dataValue });
      });
    });
  } else {
    // Update existing booking
    const where = `id = '${_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('booking not found:', err);
        return res.status(500).json({ error: 'Failed to fetch booking data.' });
      }

      const fields = 'cust_id_fk, service_id_fk, group_type, date, time, group_size, tell, email';
      const newData = [cust_id_fk, service_id_fk, group_type, date, time, group_size, tell, email, _id];
      const condition = 'id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating booking:', err);
          return res.status(500).json({ error: 'Failed to update booking.' });
        }
        res.status(200).json({ message: 'booking updated successfully', data: results });
      });
    });
  }
});

// Deactivate booking (soft delete)
router.patch('/:id', function (req, res, next) {
  const id = req.params.id;
  const fields = 'state';
  const newData = [0, id];
  const condition = 'id=?';

  db.updateData('booking', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate booking' });
    }
    res.status(200).json({ message: 'booking deactivated successfully', data: results });
  });
});

// Delete booking
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  db.deleteData('booking', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete booking.' });
    }
    res.status(200).json({ message: 'booking deleted successfully', data: results });
  });
});

// Get single booking by ID
router.get("/single/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  const tables = 'booking';
  db.singleAll(tables, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

// Get all active bookings
router.get("/", function (req, res, next) {
    const tables = `booking
       LEFT JOIN customer ON booking.cust_id_fk=customer.id 
       LEFT JOIN service ON booking.service_id_fk=service.id `;

  const fields = `
      booking.id,
      booking.book_id, 
      booking.group_type, 
      booking.date, 
      booking.time, 
      booking.email, 
      booking.tell, 
      booking.group_size,  
      booking.note,
      customer.id,
      customer.cust_id,
      customer.cust_name, 
      customer.cust_surname,
      service.id,
      service.service_name`;
      const where=`booking.state = 1`;
  db.selectWhere(tables, fields, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

module.exports = router;
