const express = require('express');
const db = require('../controller/controller.connection');
const router = express.Router();

// Handle importproduct creation (without profile upload)
router.post('/create', function (req, res) {
  const { imp_id, pro_id_fk, amount, price, date } = req.body;
  const total = amount * price; // Calculate total
  const table = 'importproduct';
  
  // Auto-generate importproduct code if it doesn't exist
  if (!imp_id) {
    db.autoId(table, 'imp_id', (err, imp_id) => {
      const fields = 'imp_id, pro_id_fk, amount, price, total, date';
      const dataValue = [imp_id, pro_id_fk, amount, price, total, date];

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting importproduct:', err);
          return res.status(500).json({ error: 'Failed to add importproduct.' });
        }
        // Update product table
        const setFields = `
          amount = amount + ${amount}, 
          price = IF(price != ${price}, ${price}, price),
          total = amount * price`;
        const condition = `pro_id = '${pro_id_fk}'`;
        db.updateField('product', setFields, condition, (err) => {
          if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Failed to update product data.' });
          }
          res.status(200).json({ message: 'importproduct added and product updated successfully.' });
        });
      });
    });
  } else {
    // Update existing importproduct
    const where = `imp_id = '${imp_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('importproduct not found:', err);
        return res.status(500).json({ error: 'Failed to fetch importproduct data.' });
      }

      const oldAmount = results[0].amount;
      const updatedTotal = amount * price; // Recalculate total
      const fields = 'pro_id_fk, amount, price, total, date';
      const newData = [pro_id_fk, amount, price, updatedTotal, date, imp_id];
      const condition = 'imp_id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating importproduct:', err);
          return res.status(500).json({ error: 'Failed to update importproduct.' });
        }
         // Adjust product table
         const deltaAmount = amount - oldAmount;
         const setFields = `
           amount = amount + ${deltaAmount}, 
           price = IF(price != ${price}, ${price}, price),
           total = amount * price`;
           const productCondition = `pro_id = '${pro_id_fk}'`;

           db.updateField('product', setFields, productCondition, (err) => {
             if (err) {
               console.error('Error updating product:', err);
               return res.status(500).json({ error: 'Failed to update product data.' });
             }
             res.status(200).json({ message: 'importproduct updated and product updated successfully.' });
      });
    });
  });
  }
});

// Delete importproduct
router.delete('/:imp_id', function (req, res, next) {
  const imp_id = req.params.imp_id;
  const where = `imp_id='${imp_id}'`;

  // Fetch the importproduct before deletion to adjust product data
  db.selectWhere('importproduct', '*', where, (err, results) => {
    if (err || !results.length) {
      return res.status(500).json({ error: 'Failed to fetch importproduct data.' });
    }
    const { pro_id_fk, amount } = results[0];
  db.deleteData('importproduct', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete importproduct.' });
    }
     // Adjust product table
     const setFields = `
     amount = amount - ${amount},
     total = amount * price`;
   const productCondition = `pro_id = '${pro_id_fk}'`;

   db.updateField('product', setFields, productCondition, (err) => {
     if (err) {
       console.error('Error updating product:', err);
       return res.status(500).json({ error: 'Failed to update product data.' });
     }
     res.status(200).json({ message: 'importproduct deleted and product updated successfully.' });
     });
   });
  });
});

// Get single importproduct by ID
router.get('/single/:imp_id', function (req, res, next) {
  const imp_id = req.params.imp_id;
  const where = `imp_id='${imp_id}'`;
  const tables = 'importproduct';
  db.singleAll(tables, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

// Get all active importproducts
router.get('/', function (req, res, next) {
  const tables = `importproduct
       LEFT JOIN product ON importproduct.pro_id_fk=product.pro_id`;

  const fields = `
      importproduct.imp_id,
      importproduct.pro_id_fk, 
      importproduct.amount, 
      importproduct.price, 
      importproduct.total, 
      importproduct.date,
      product.pro_code,
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