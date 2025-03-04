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
// Handle checkin creation (without profile upload)
router.post('/create', function (req, res) {
  let { checkin_id, date_checkin, date_checkout } = req.body;
  const table = 'checkin';
  
  if (!checkin_id) {
    db.autoId(table, 'checkin_id', (err, checkin_id) => {
      const fields = 'checkin_id, date_checkin, date_checkout, state';
      const dataValue = [checkin_id, date_checkin, date_checkout, 1, 1]; 

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting checkin:', err);
          return res.status(500).json({ error: 'Failed to add checkin.' });
        }
        // Update customer status to active (1)
        updateCustomerStatus(cust_id_fk, 2, (err, customerResults) => {
          if (err) {
            console.error('Error updating customer status:', err);
            return res.status(500).json({ error: 'Failed to update customer status.' });
          }
          console.log('checkin added successfully!');
          return res.status(200).json({ message: 'checkin added successfully.', checkin: dataValue });
        });
      });
    });
  } else {
    // Fetch existing cust_id_fk before updating
    db.selectWhere(table, 'cust_id_fk', `checkin_id='${checkin_id}'`, (err, results) => {
      if (err || !results.length) {
        console.error('checkin not found:', err);
        return res.status(500).json({ error: 'Failed to fetch checkin data.' });
      }
      const old_cust_id_fk = results[0].cust_id_fk;

      updateCustomerStatus(old_cust_id_fk, 0, (err) => {
        if (err) {
          console.error('Error updating old customer status:', err);
          return res.status(500).json({ error: 'Failed to update old customer status.' });
        }

        // Update checkin with new cust_id_fk
        const fields = 'date_checkin, date_checkout';
        const newData = [date_checkin, date_checkout, checkin_id];
        const condition = 'checkin_id=?';
        db.updateData(table, fields, newData, condition, (err, results) => {
          if (err) {
            console.error('Error updating checkin:', err);
            return res.status(500).json({ error: 'Failed to update checkin.' });
          }

          // Set new cust_id_fk status to active (1)
          updateCustomerStatus(cust_id_fk, 1, (err) => {
            if (err) {
              console.error('Error updating new customer status:', err);
              return res.status(500).json({ error: 'Failed to update new customer status.' });
            }
            console.log('checkin updated successfully!');
            res.status(200).json({ message: 'checkin updated successfully', data: results });
          });
        });
      });
    });
  }
});

// Deactivate checkin (soft delete)
router.patch('/:checkin_id', function (req, res) {
  const checkin_id = req.params.checkin_id;
  
  const fields = 'state';
  const newData = [0, checkin_id];
  const condition = 'checkin_id=?';

  db.updateData('checkin', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate checkin' });
    }

    // Update customer status to 0 (inactive) when deactivating checkin
    updateCustomerStatus(req.body.cust_id_fk, 0, (err) => {
      if (err) {
        console.error('Error updating customer status:', err);
        return res.status(500).json({ error: 'Failed to update customer status.' });
      }

      res.status(200).json({ message: 'checkin deactivated successfully', data: results });
    });
  });
});

// Delete checkin
router.delete('/:checkin_id', function (req, res) {
  const checkin_id = req.params.checkin_id;
  const where = `checkin_id='${checkin_id}'`;

  db.deleteData('checkin', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete checkin.' });
    }

    // Update customer status to 0 (inactive) when the checkin is deleted
    updateCustomerStatus(req.body.cust_id_fk, 0, (err) => {
      if (err) {
        console.error('Error updating customer status:', err);
        return res.status(500).json({ error: 'Failed to update customer status.' });
      }

      res.status(200).json({ message: 'checkin deleted successfully', data: results });
    });
  });
});

// Get single checkin by checkin_id
router.get('/single/:checkin_id', function (req, res) {
  const checkin_id = req.params.checkin_id;
  const where = `checkin_id='${checkin_id}'`;
  const tables = 'checkin';
  db.singleAll(tables, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

// Get all active checkins
router.get('/', function (req, res) {
  const tables = `checkin 
  LEFT JOIN booking ON checkin.book_fk = booking.book_id
  LEFT JOIN bps_association ON checkin.book_fk = bps_association.book_association_fk 
  LEFT JOIN package ON package.pk_id = bps_association.pk_association_fk
  LEFT JOIN customer ON booking.cust_id_fk = customer.cust_id
  `;

  const fields = `
      checkin.checkin_id,
      checkin.book_fk,
      checkin.status, 
      checkin.date_checkin, 
      checkin.date_checkout,
      booking.book_id,
      booking.book_code,
      booking.group_size,  
      customer.cust_id,
      customer.cust_name, 
      customer.cust_surname,
      package.pk_id,
      package.pk_name
      `;
  const where = `checkin.state = 1`;

  db.selectWhere(tables, fields, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

module.exports = router;