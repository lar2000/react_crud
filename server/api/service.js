const express = require('express')
const db = require('./db_connection')

const service = express.Router();
service.get('/service', (req, res) => {
  db.query('SELECT * FROM service',
     (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = service;