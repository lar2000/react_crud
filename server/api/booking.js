const express = require('express');
const db = require('./db_connection');
const router = express.Router();

// Handle booking creation (without profile upload)
router.post('/create', function (req, res) {
  const { book_id, cust_id_fk, service_id_fk, group_type, date, dateEnd, group_size, tell, email, note } = req.body;
  const table = 'booking';
  
  // Auto-generate booking code if it doesn't exist
  if (!book_id) {
    db.autoId(table, 'book_id', (err, book_id) => {
      const code = book_id.toString().slice(-4).padStart(4, '0');
      const book_code = 'B-' + code;
      const fields = 'book_id, book_code, cust_id_fk, service_id_fk, group_type, date, dateEnd, group_size, tell, email, note, state';
      const dataValue = [book_id, book_code, cust_id_fk, service_id_fk, group_type, date, group_size, tell, email, note, 1]; // Default state to 1 (active)

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting booking:', err);
          return res.status(500).json({ error: 'Failed to add booking.' });
        }
        console.log('Booking added successfully!');
        return res.status(200).json({ message: 'Booking added successfully.', booking: dataValue });
      });
    });
  } else {
    // Update existing booking
    const where = `book_id = '${book_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('Booking not found:', err);
        return res.status(500).json({ error: 'Failed to fetch booking data.' });
      }

      const fields = 'cust_id_fk, service_id_fk, group_type, date, dateEnd, group_size, tell, email, note';
      const newData = [cust_id_fk, service_id_fk, group_type, date, group_size, tell, email, note, book_id];
      const condition = 'book_id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating booking:', err);
          return res.status(500).json({ error: 'Failed to update booking.' });
        }
        res.status(200).json({ message: 'Booking updated successfully', data: results });
      });
    });
  }
});

// Deactivate booking (soft delete)
router.patch('/:book_id', function (req, res) {
  const book_id = req.params.book_id;
  const fields = 'state';
  const newData = [0, book_id];
  const condition = 'book_id=?';

  db.updateData('booking', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate booking' });
    }
    res.status(200).json({ message: 'Booking deactivated successfully', data: results });
  });
});

// Delete booking
router.delete('/:book_id', function (req, res) {
  const book_id = req.params.book_id;
  const where = `book_id='${book_id}'`;
  db.deleteData('booking', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete booking.' });
    }
    res.status(200).json({ message: 'Booking deleted successfully', data: results });
  });
});

// Get single booking by book_id
router.get('/single/:book_id', function (req, res) {
  const book_id = req.params.book_id;
  const where = `book_id='${book_id}'`;
  const tables = 'booking';
  db.singleAll(tables, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

// Get all active bookings
router.get('/', function (req, res) {
  const tables = `booking
       LEFT JOIN customer ON booking.cust_id_fk=customer.cust_id 
       LEFT JOIN service ON booking.service_id_fk=service.service_id `;

  const fields = `
      booking.book_id,
      booking.service_id_fk,
      booking.cust_id_fk,
      booking.book_code, 
      booking.group_type, 
      booking.date, 
      booking.dateEnd, 
      booking.email, note, 
      booking.tell, 
      booking.group_size,  
      booking.note,
      customer.cust_code,
      customer.cust_name, 
      customer.cust_surname,
      service.price,
      service.service_name`;
  const where = `booking.state = 1`;
  db.selectWhere(tables, fields, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

module.exports = router;