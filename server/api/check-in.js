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
  let { checkin_id, cust_id_fk, service_id_fk, dur_id_fk, time_per_day_fk, group_type, date, group_size, tell, email, note } = req.body;
  const table = 'checkin';
  group_type = group_size > 1 ? 'ກຸ່ມ' : 'ບຸກຄົນ';
  
  if (!checkin_id) {
    db.autoId(table, 'checkin_id', (err, checkin_id) => {
      const code = checkin_id.toString().slice(-4).padStart  (4, '0');
      const checkin_code = 'B-' + code;
      const fields = 'checkin_id, checkin_code, cust_id_fk, service_id_fk, dur_id_fk, time_per_day_fk, group_type, date, dateEnd, group_size, tell, email, note, state';
      const dataValue = [checkin_id, checkin_code, cust_id_fk, service_id_fk, dur_id_fk, time_per_day_fk, group_type, date[0], date[1], group_size, tell, email, note, 1]; 

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting checkin:', err);
          return res.status(500).json({ error: 'Failed to add checkin.' });
        }
        // Update customer status to active (1)
        updateCustomerStatus(cust_id_fk, 1, (err, customerResults) => {
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
        const fields = 'cust_id_fk, service_id_fk, dur_id_fk, time_per_day_fk, group_type, date, dateEnd, group_size, tell, email, note';
        const newData = [cust_id_fk, service_id_fk, dur_id_fk, time_per_day_fk, group_type, date[0], date[1], group_size, tell, email, note, checkin_id];
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
       LEFT JOIN customer ON checkin.cust_id_fk = customer.cust_id
       LEFT JOIN duration ON checkin.dur_id_fk = duration.dur_id 
       LEFT JOIN time_per_day ON checkin.time_per_day_fk = time_per_day.time_per_day_id `;

  const fields = `
      checkin.checkin_id,
      checkin.book_fk,
      checkin.date_checkin, 
      checkin.date_checkout, 
      customer.cust_code,
      customer.cust_name, 
      customer.cust_surname,
      duration.duration, 
      time_per_day.time_per_day`;
  const where = `checkin.state = 1`;

  db.selectWhere(tables, fields, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

module.exports = router;