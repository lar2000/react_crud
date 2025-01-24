const express = require('express');
const db = require('./db_connection');
const router = express.Router();

// Handle importproduct creation (without profile upload)
router.post('/create', function (req, res) {
  const {_id, pro_id_fk, amount, price, total, date } = req.body;
  const table = 'importproduct';
  
  // Auto-generate importproduct ID if it doesn't exist
  if (!_id) {
    db.autoId(table, 'id', (err, id) => {
      // const code = id.toString().slice(-4).padStart(4, '0');
      // const impId = 'IMPD-' + code;
      const fields = 'id, pro_id_fk, amount, price, total, date';
      const dataValue = [id, pro_id_fk, amount, price, total, date];

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting importproduct:', err);
          return res.status(500).json({ error: 'Failed to add importproduct.' });
        }
        console.log('importproduct added successfully!');
        return res.status(200).json({ message: 'importproduct added successfully.'});
      });
    });
  } else {
    // Update existing importproduct
    const where = `id = '${_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('importproduct not found:', err);
        return res.status(500).json({ error: 'Failed to fetch importproduct data.' });
      }

      const fields = 'pro_id_fk, amount, price, total, date';
      const newData = [pro_id_fk, amount, price, total, date, _id];
      const condition = 'id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating importproduct:', err);
          return res.status(500).json({ error: 'Failed to update importproduct.' });
        }
        res.status(200).json({ message: 'importproduct updated successfully', data: results });
      });
    });
  }
});

// Deactivate importproduct (soft delete)
// router.patch('/:id', function (req, res, next) {
//   const id = req.params.id;
//   const fields = 'total';
//   const newData = [0, id];
//   const condition = 'id=?';

//   db.updateData('importproduct', fields, newData, condition, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to deactivate importproduct' });
//     }
//     res.status(200).json({ message: 'importproduct deactivated successfully', data: results });
//   });
// });

// Delete importproduct
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  db.deleteData('importproduct', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete importproduct.' });
    }
    res.status(200).json({ message: 'importproduct deleted successfully', data: results });
  });
});

// Get single importproduct by ID
router.get("/single/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  const tables = 'importproduct';
  db.singleAll(tables, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.price(200).json(results);
  });
});

// Get all active importproducts
router.get("/", function (req, res, next) {
  const tables = `importproduct
       LEFT JOIN product ON importproduct.pro_id_fk=product.id`;

  const fields = `
      importproduct.id,
      importproduct.pro_id_fk, 
      importproduct.amount, 
      importproduct.price, 
      importproduct.total, 
      importproduct.date,
      product.pro_id,
      product.pro_name,
      product.size`;

  db.selectData(tables, fields, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});

module.exports = router;
