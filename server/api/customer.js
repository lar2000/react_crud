const express = require('express');
const db = require('./db_connection');
const router = express.Router();

// Handle customer creation (without profile upload)
router.post('/create', function (req, res) {
  const {_id, cust_name, cust_surname, email} = req.body;
  const table = 'customer';
  
  // Auto-generate customer ID if it doesn't exist
  if (!_id) {
    db.autoId(table, 'cust_id', (err, id) => {
      const code = id.toString().slice(-4).padStart(4, '0');
      const custCode = 'C-' + code;
      const fields = 'cust_id, cust_code, cust_name, cust_surname, email, status, state';
      const dataValue = [id, custCode, cust_name, cust_surname, email, 0, 1]; // Default state to 1 (active)

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting customer:', err);
          return res.status(500).json({ error: 'Failed to add customer.' });
        }
        console.log('Customer added successfully!');
        return res.status(200).json({ message: 'Customer added successfully.', customer: dataValue });
      });
    });
  } else {
    // Update existing customer
    const where = `cust_id = '${_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('Customer not found:', err);
        return res.status(500).json({ error: 'Failed to fetch customer data.' });
      }

      const fields = 'cust_name, cust_surname, email';
      const newData = [cust_name, cust_surname, email, _id];
      const condition = 'cust_id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating customer:', err);
          return res.status(500).json({ error: 'Failed to update customer.' });
        }
        res.status(200).json({ message: 'Customer updated successfully', data: results });
      });
    });
  }
});

// Deactivate customer (soft delete)
router.patch('/:id', function (req, res, next) {
  const id = req.params.id;
  const fields = 'state';
  const newData = [0, id];
  const condition = 'cust_id=?';

  db.updateData('customer', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate customer' });
    }
    res.status(200).json({ message: 'Customer deactivated successfully', data: results });
  });
});

// Delete customer
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  const where = `cust_id='${id}'`;
  db.deleteData('customer', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete customer.' });
    }
    res.status(200).json({ message: 'Customer deleted successfully', data: results });
  });
});

// Get single customer by ID
router.get('/single/:id', function (req, res, next) {
  const id = req.params.id;
  const where = `cust_id='${id}'`;
  const tables = 'customer';
  db.singleAll(tables, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

// Get all active customers
router.get('/', function (req, res, next) {
  const tables = 'customer';
  const fields = 'cust_id, cust_code, cust_name, cust_surname, email, status';
  const where = 'state = 1';
  db.selectWhere(tables, fields, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

module.exports = router;