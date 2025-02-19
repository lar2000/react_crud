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
  let { book_id, cust_id_fk, pay_fk, sv_fk = [], pk_fk = [], group_size, date, tell, email, note } = req.body;
  const table = 'booking';
  const group_type = group_size > 1 ? 'ກຸ່ມ' : 'ບຸກຄົນ';

  // Ensure sv_fk and pk_fk are always arrays
  sv_fk = Array.isArray(sv_fk) ? sv_fk : [];
  pk_fk = Array.isArray(pk_fk) ? pk_fk : [];

  if (!book_id) {
    db.autoId(table, 'book_id', (err, id) => {
      if (err) return res.status(500).json({ error: 'Failed to generate booking ID.' });

      const book_code = 'B-' + id.toString().slice(-4).padStart(4, '0');
      const fields = 'book_id, book_code, cust_id_fk, pay_fk, group_type, date, group_size, tell, email, note, state';
      const dataValue = [id, book_code, cust_id_fk, pay_fk, group_type, date, group_size, tell, email, note, 1];

      db.insertData(table, fields, dataValue, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to add booking.' });

        insertAssociations(id, sv_fk, pk_fk);

        updateCustomerStatus(cust_id_fk, 1, (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update customer status.' });

          res.status(200).json({ message: 'Booking added successfully.', booking: dataValue });
        });
      });
    });
  } else {
    // Fetch existing cust_id_fk before updating
    db.selectWhere(table, 'cust_id_fk', `book_id='${book_id}'`, (err, results) => {
      if (err || !results.length) return res.status(500).json({ error: 'Failed to fetch booking data.' });

      const old_cust_id_fk = results[0].cust_id_fk;
      updateCustomerStatus(old_cust_id_fk, 0, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to update old customer status.' });

        const fields = 'cust_id_fk, pay_fk, group_type, date, group_size, tell, email, note';
        const newData = [cust_id_fk, pay_fk, group_type, date, group_size, tell, email, note, book_id];
        const condition = 'book_id=?';

        db.updateData(table, fields, newData, condition, (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update booking.' });

          // Delete old associations and insert new ones
          db.deleteData('bps_association', `book_association_fk = '${book_id}'`, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to delete associations.' });

            insertAssociations(book_id, sv_fk, pk_fk);
            updateCustomerStatus(cust_id_fk, 1, (err) => {
              if (err) return res.status(500).json({ error: 'Failed to update new customer status.' });

              res.status(200).json({ message: 'Booking updated successfully' });
            });
          });
        });
      });
    });
  }
});

// Function to insert associations
function insertAssociations(book_id, sv_fk, pk_fk) {
  if (sv_fk.length || pk_fk.length) {
    (sv_fk.length ? sv_fk : [null]).forEach(service_id => {
      (pk_fk.length ? pk_fk : [null]).forEach(pk_id => {
        const fields = ['book_association_fk'];
        const values = [book_id];

        if (service_id) {
          fields.push('sv_association_fk');
          values.push(service_id);
        }
        if (pk_id) {
          fields.push('pk_association_fk');
          values.push(pk_id);
        }

        db.insertData('bps_association', fields.join(','), values, (err) => {
          if (err) console.error('Error inserting bps_association:', err);
        });
      });
    });
  }
}

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
       LEFT JOIN payment ON booking.pay_fk = payment.pay_id 
       LEFT JOIN bps_association ON booking.book_id = bps_association.book_association_fk 
       LEFT JOIN service ON service.service_id = bps_association.sv_association_fk 
       LEFT JOIN package ON package.pk_id = bps_association.pk_association_fk`;

  const fields = `
      booking.book_id,
      booking.cust_id_fk,
      booking.book_code, 
      booking.group_type, 
      booking.date, 
      booking.email,
      booking.tell, 
      booking.group_size,  
      CASE WHEN booking.note = '' THEN 'ບໍ່ລະບຸ' ELSE booking.note END AS note,
      customer.cust_code,
      customer.cust_name, 
      customer.cust_surname,
      payment.pay_id,
      payment.calculation,
      payment.pay_date,
      payment.pay_status,
      GROUP_CONCAT(bps_association.pk_association_fk) AS pk_fk,
      GROUP_CONCAT(bps_association.sv_association_fk) AS sv_fk,
      GROUP_CONCAT(package.pk_name) AS pk_names,
      GROUP_CONCAT(service.service_name) AS service_names
  `;

  const where = `booking.state = 1 GROUP BY booking.book_id`;

  db.selectWhere(tables, fields, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    results.forEach(row => { 
      row.pk_fk = row.pk_fk ? row.pk_fk.split(',') : []; // Ensure it's an array
      row.sv_fk = row.sv_fk ? row.sv_fk.split(',') : []; // Ensure it's an array
    });
    res.status(200).json(results);
  });
});

module.exports = router;