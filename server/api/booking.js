const express = require('express');
const db = require('../controller/controller.connection');
const router = express.Router();

// Helper function to update customer status
function updateCustomerStatus(cust_id_fk, status, callback) {
  const customerFields = 'status';
  const customerData = [status, cust_id_fk]; // Set the status value
  const customerCondition = 'cust_id = ?';
  db.updateData('customer', customerFields, customerData, customerCondition, callback);
}
// Handle booking creation (without profile upload)
router.post('/create', function (req, res) {
  let { book_id, cust_id_fk, service_id_fk, dur_id_fk, group_type, date, group_size, tell, email, note } = req.body;
  const table = 'booking';
  group_type = group_size > 1 ? 'ກຸ່ມ' : 'ບຸກຄົນ';
  
  if (!book_id) {
    db.autoId(table, 'book_id', (err, book_id) => {
      const code = book_id.toString().slice(-4).padStart  (4, '0');
      const book_code = 'B-' + code;
      const fields = 'book_id, book_code, cust_id_fk, service_id_fk, dur_id_fk, group_type, date, dateEnd, group_size, tell, email, note, state';
      const dataValue = [book_id, book_code, cust_id_fk, service_id_fk, dur_id_fk, group_type, date[0], date[1], group_size, tell, email, note, 1]; 

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting booking:', err);
          return res.status(500).json({ error: 'Failed to add booking.' });
        }
        // Update customer status to active (1)
        updateCustomerStatus(cust_id_fk, 1, (err, customerResults) => {
          if (err) {
            console.error('Error updating customer status:', err);
            return res.status(500).json({ error: 'Failed to update customer status.' });
          }
          console.log('Booking added successfully!');
          return res.status(200).json({ message: 'Booking added successfully.', booking: dataValue });
        });
      });
    });
  } else {
    // Fetch existing cust_id_fk before updating
    db.selectWhere(table, 'cust_id_fk', `book_id='${book_id}'`, (err, results) => {
      if (err || !results.length) {
        console.error('Booking not found:', err);
        return res.status(500).json({ error: 'Failed to fetch booking data.' });
      }
      const old_cust_id_fk = results[0].cust_id_fk;

      updateCustomerStatus(old_cust_id_fk, 0, (err) => {
        if (err) {
          console.error('Error updating old customer status:', err);
          return res.status(500).json({ error: 'Failed to update old customer status.' });
        }

        // Update booking with new cust_id_fk
        const fields = 'cust_id_fk, service_id_fk, dur_id_fk, group_type, date, dateEnd, group_size, tell, email, note';
        const newData = [cust_id_fk, service_id_fk, dur_id_fk, group_type, date[0], date[1], group_size, tell, email, note, book_id];
        const condition = 'book_id=?';
        db.updateData(table, fields, newData, condition, (err, results) => {
          if (err) {
            console.error('Error updating booking:', err);
            return res.status(500).json({ error: 'Failed to update booking.' });
          }

          // Set new cust_id_fk status to active (1)
          updateCustomerStatus(cust_id_fk, 1, (err) => {
            if (err) {
              console.error('Error updating new customer status:', err);
              return res.status(500).json({ error: 'Failed to update new customer status.' });
            }
            console.log('Booking updated successfully!');
            res.status(200).json({ message: 'Booking updated successfully', data: results });
          });
        });
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

    // Update customer status to 0 (inactive) when deactivating booking
    updateCustomerStatus(req.body.cust_id_fk, 0, (err) => {
      if (err) {
        console.error('Error updating customer status:', err);
        return res.status(500).json({ error: 'Failed to update customer status.' });
      }

      res.status(200).json({ message: 'Booking deactivated successfully', data: results });
    });
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

    // Update customer status to 0 (inactive) when the booking is deleted
    updateCustomerStatus(req.body.cust_id_fk, 0, (err) => {
      if (err) {
        console.error('Error updating customer status:', err);
        return res.status(500).json({ error: 'Failed to update customer status.' });
      }

      res.status(200).json({ message: 'Booking deleted successfully', data: results });
    });
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
       LEFT JOIN customer ON booking.cust_id_fk = customer.cust_id 
       LEFT JOIN payment ON booking.book_id = payment.book_id_fk 
       LEFT JOIN duration ON booking.dur_id_fk = duration.dur_id 
       LEFT JOIN service ON booking.service_id_fk = service.service_id`;

  const fields = `
      booking.book_id,
      booking.service_id_fk, dur_id_fk,
      booking.cust_id_fk,
      booking.dur_id_fk,
      booking.book_code, 
      booking.group_type, 
      booking.date, 
      booking.dateEnd, 
      booking.email,
      booking.tell, 
      booking.group_size,  
      CASE WHEN booking.note = '' THEN 'ບໍ່ລະບຸ' ELSE booking.note END AS note,
      customer.cust_code,
      customer.cust_name, 
      customer.cust_surname,
      payment.pay_id,
      payment.paytype_id_fk,
      payment.total_price,
      payment.pay_date,
      payment.detail,
      duration.duration, 
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