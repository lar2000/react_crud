const express = require('express');
const db = require('./db_connection');

const imp = express.Router();
const insertFields = ['imp_id', 'pro_id_fk', 'amount', 'date'];

// Get all imps
imp.get('/imp', (req, res) => {
  const query = `
    SELECT 
      importproduct.imp_id,
      importproduct.pro_id_fk,
      product.pro_id,
      product.pro_code,
      product.pro_name, 
      importproduct.amount,
      product_type.protype_name, 
      importproduct.date
    FROM 
      importproduct
    LEFT JOIN 
      product ON importproduct.pro_id_fk = product.pro_id 
    LEFT JOIN 
      product_type ON product.protype_id_fk = product_type.protype_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to retrieve import products.' });
    }
    res.json(results);
  });
});

// Add a new imp
imp.post('/imp', (req, res) => {
  const { pro_id_fk, amount, date } = req.body;

  if (!pro_id_fk || !amount || !date) {
    return res.status(400).json({ error: 'pro_id_fk, amount, and date are required.' });
  }

  const getMaxIdQuery = 'SELECT MAX(imp_id) AS maxId FROM importproduct';

  db.query(getMaxIdQuery, (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to retrieve the maximum imp_id.' });
    }

    const nextImpId = (result[0].maxId ? result[0].maxId : 999) + 1;
    const insertQuery = `INSERT INTO importproduct (${insertFields.join(', ')}) VALUES (?, ?, ?, ?)`;
    const values = [nextImpId, pro_id_fk, amount, date];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to add import product.' });
      }
      res.status(201).json({ id: nextImpId, pro_id_fk, amount, date });
    });
  });
});

// Update an existing imp
imp.put('/imp/:id', (req, res) => {
  const {pro_id_fk, amount, date } = req.body;

  if (!pro_id_fk || !amount || !date) {
    return res.status(400).json({ error: 'amount and date are required.' });
  }

  const query = `UPDATE importproduct SET pro_id_fk = ?, amount = ?, date = ? WHERE imp_id = ?`;
  const values = [pro_id_fk, amount, date, req.params.id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to update import product.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Import product not found.' });
    }
    res.status(200).json({ message: 'Import product updated successfully.', id: req.params.id, amount, date });
  });
});

// Delete an imp (hard delete)
imp.delete('/imp/:id', (req, res) => {
  const query = 'DELETE FROM importproduct WHERE imp_id = ?';
  const values = [req.params.id];

  db.query(query, values, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to delete import product.' });
    }
    res.status(204).send();
  });
});

module.exports = imp;
