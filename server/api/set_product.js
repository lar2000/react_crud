const express = require('express');
const db = require('../controller/controller.connection');
const router = express.Router();

// Handle set_product creation (without profile upload)
// Handle set_product creation (without profile upload)
router.post('/create', function (req, res) {
  const { _id, pro_id_fk = [], set_name, detail } = req.body;
  const table = 'set_product';

  if (!Array.isArray(pro_id_fk)) {
    return res.status(400).json({ error: 'pro_id_fk must be an array.' });
  }

  if (!_id) {
    db.autoId(table, 'set_id', (err, id) => {
      if (err) {
        console.error('Error generating ID:', err);
        return res.status(500).json({ error: 'Failed to generate ID.' });
      }

      const code = id.toString().slice(-4).padStart(4, '0');
      const setCode = 'SET-' + code; // Changed set_id to set_code
      const fields = 'set_id, set_code, set_name, detail'; // Changed set_id to set_code
      const dataValue = [id, setCode, set_name, detail];

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting set_product:', err);
          return res.status(500).json({ error: 'Failed to add set_product.' });
        }

        if (pro_id_fk.length > 0) {
          pro_id_fk.forEach(pro_id => {
            const associationFields = 'set_fk, pro_id_fk';
            const associationData = [id, pro_id];

            db.insertData('set_prod_association', associationFields, associationData, (err, results) => {
              if (err) {
                console.error('Error inserting set_product_association:', err);
              }
            });
          });
        }

        console.log('set_product and associations added successfully!');
        return res.status(200).json({ message: 'set_product added successfully.', set_product: dataValue });
      });
    });
  } else {
    const where = `set_id = '${_id}'`; // Changed id to set_id

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('set_product not found:', err);
        return res.status(500).json({ error: 'Failed to fetch set_product data.' });
      }

      const fields = 'set_name, detail';
      const newData = [set_name, detail, _id];
      const condition = 'set_id=?'; // Changed id to set_id

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating set_product:', err);
          return res.status(500).json({ error: 'Failed to update set_product.' });
        }

        const deleteCondition = `set_fk = (SELECT set_id FROM ${table} WHERE set_id = '${_id}')`; // Changed id to set_id

        db.deleteData('set_prod_association', deleteCondition, (err, results) => {
          if (err) {
            console.error('Error deleting associations:', err);
            return res.status(500).json({ error: 'Failed to delete associations.' });
          }

          if (pro_id_fk.length > 0) {
            pro_id_fk.forEach(pro_id => {
              const associationFields = 'set_fk, pro_id_fk';
              const associationData = [_id, pro_id];

              db.insertData('set_prod_association', associationFields, associationData, (err, results) => {
                if (err) {
                  console.error('Error inserting set_product_association:', err);
                }
              });
            });
          }

          console.log('set_product and associations updated successfully!');
          res.status(200).json({ message: 'set_product updated successfully.' });
        });
      });
    });
  }
});

// Deactivate set_product (soft delete)
router.patch('/:id', function (req, res, next) {
  const id = req.params.id;
  const fields = 'state';
  const newData = [0, id];
  const condition = 'set_id=?'; // Changed id to set_id

  db.updateData('set_product', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate set_product' });
    }
    res.status(200).json({ message: 'set_product deactivated successfully', data: results });
  });
});

// Delete set_product
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;

  // First, delete the associations from the set_product_association table
  const deleteAssociationsCondition = `set_fk = (SELECT set_id FROM set_product WHERE set_id = '${id}')`; // Changed id to set_id

  db.deleteData('set_prod_association', deleteAssociationsCondition, (err, results) => {
    if (err) {
      console.error('Error deleting associations:', err);
      return res.status(500).json({ error: 'Failed to delete associations.' });
    }

    // Now delete the set_product
    const deleteSetCondition = `set_id = '${id}'`; // Changed id to set_id

    db.deleteData('set_product', deleteSetCondition, (err, results) => {
      if (err) {
        console.error('Error deleting set_product:', err);
        return res.status(500).json({ error: 'Failed to delete set_product.' });
      }

      console.log('set_product and its associations deleted successfully!');
      res.status(200).json({ message: 'set_product and its associations deleted successfully.' });
    });
  });
});

// Get single set_product by ID
router.get('/single/:id', function (req, res, next) {
  const id = req.params.id;
  const where = `set_product.set_id='${id}'`; // Changed id to set_id

  const tables = `
    set_product
    LEFT JOIN set_prod_association ON set_product.set_id = set_prod_association.set_fk
    LEFT JOIN product ON set_prod_association.pro_id_fk = product.pro_id
  `;
  const fields = `
    set_product.set_id,
    set_product.set_code,
    set_product.set_name,
    set_product.detail,
    GROUP_CONCAT(product.pro_name) AS product_names
  `;

  db.selectData(tables, fields, where, (err, results) => {
    if (err || !results.length) {
      console.error('Error fetching set_product data:', err);
      return res.status(500).json({ error: 'Failed to fetch set_product data.' });
    }

    res.status(200).json(results);
  });
});

// Get all active set_products
router.get('/', function (req, res, next) {
  const tables = `
    set_product
    LEFT JOIN set_prod_association ON set_product.set_id = set_prod_association.set_fk 
    LEFT JOIN product ON set_prod_association.pro_id_fk = product.pro_id 
    GROUP BY set_product.set_id`;

  const fields = `
    set_product.set_id,
    set_product.set_code,
    set_product.set_name,
    set_product.detail,
    set_prod_association.spa_id,
    set_prod_association.set_fk,
    GROUP_CONCAT(set_prod_association.pro_id_fk) AS pro_id_fk,
    GROUP_CONCAT(product.pro_name) AS pro_names
  `;

  db.selectData(tables, fields, (err, results) => {
    if (err) {
      console.error('Error fetching set_products:', err);
      return res.status(400).send();
    }
    results.forEach(row => {
      row.pro_id_fk = row.pro_id_fk.split(','); // Split the string into an array
    });
    res.status(200).json(results);
  });
});
module.exports = router;