const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../controller/controller.connection');
const router = express.Router();

router.post('/create', function (req, res) {
  let pk_images = null;
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/pk_images');
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        pk_images = `pk-${Date.now()}${ext}`;
        cb(null, pk_images);
      }
    });
    const upload = multer({ storage }).single('pk_images');

    upload(req, res, function (err) {
    const { _id, association_service_fk = [], pk_name, pk_price} = req.body;
    const table = 'package';

      if (!Array.isArray(association_service_fk)) {
        return res.status(400).json({ error: 'association_service_fk must be an array.' });
      }

    if (!_id) {
      db.autoId(table, 'pk_id', (err, id) => {
        if (err) {
          console.error('Error generating ID:', err);
          return res.status(500).json({ error: 'Failed to generate ID.' });
        }

        const code = id.toString().slice(-4).padStart(4, '0');
        const pkCode = 'PK-' + code; // Changed pk_id to pk_code
        const fields = 'pk_id, pk_code, pk_name, pk_price, set_id_fk, pk_images'; // Changed pk_id to pk_code
        const dataValue = [id, pkCode, pk_name, pk_price, set_id_fk, pk_images];

        db.insertData(table, fields, dataValue, (err, results) => {
          if (err) {
            console.error('Error inserting package:', err);
            return res.status(500).json({ error: 'Failed to add package.' });
          }

          if (association_service_fk.length > 0) {
            association_service_fk.forEach(service_id => {
              const associationFields = 'association_pk_fk, association_service_fk';
              const associationData = [id, service_id];

              db.insertData('pk_service_association', associationFields, associationData, (err, results) => {
                if (err) {
                  console.error('Error inserting package_association:', err);
                  return res.status(200).json({ message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ: ', associationData });
                }
              });
            });
          }
          console.log('package and associations added successfully!');
          return res.status(200).json({ message: 'package added successfully.', package: dataValue });
        });
      });
    } else {
    const where = `pk_id = '${_id}'`; // Changed id to pk_id

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('package not found:', err);
        return res.status(500).json({ error: 'Failed to fetch package data.' });
      }
      if (results[0].pk_images && pk_images) {
                const filePath = path.resolve('./uploads/pk_images', results[0].pk_images);
                fs.unlink(filePath, (err) => {
                  if (err) {
                    console.error('Error deleting old file:', err);
                  }
                });
              }
      
          const updatedimage = pk_images || results[0].pk_images;
          const fields = 'pk_name, pk_price, set_id_fk, pk_images';
          const newData = [pk_name, pk_price, set_id_fk, updatedimage, _id];
          const condition = 'pk_id=?'; // Changed id to pk_id

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating package:', err);
          return res.status(500).json({ error: 'Failed to update package.' });
        }

        const deleteCondition = `association_pk_fk = (SELECT pk_id FROM ${table} WHERE pk_id = '${_id}')`; // Changed id to pk_id

        db.deleteData('pk_service_association', deleteCondition, (err, results) => {
          if (err) {
            console.error('Error deleting associations:', err);
            return res.status(500).json({ error: 'Failed to delete associations.' });
          }

          if (association_service_fk.length > 0) {
            association_service_fk.forEach(service_id => {
              const associationFields = 'association_pk_fk, association_service_fk';
              const associationData = [_id, service_id];

              db.insertData('pk_service_association', associationFields, associationData, (err, results) => {
                if (err) {
                  console.error('Error inserting package_association:', err);
                }
              });
            });
          }
          console.log('package and associations updated successfully!');
          res.status(200).json({ message: 'package updated successfully.' });
        });
      });
    });
   }
 });
});

// Deactivate package (soft delete)
router.patch('/:id', function (req, res, next) {
  const id = req.params.id;
  const fields = 'state';
  const newData = [0, id];
  const condition = 'pk_id=?'; // Changed id to pk_id

  db.updateData('package', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate package' });
    }
    res.status(200).json({ message: 'package deactivated successfully', data: results });
  });
});

// Delete package
router.delete('/:id', function (req, res, next) {
  const id = req.params.id;

  // First, delete the associations from the package_association table
  const deleteAssociationsCondition = `association_pk_fk = (SELECT pk_id FROM package WHERE pk_id = '${id}')`; // Changed id to pk_id

  db.deleteData('pk_service_association', deleteAssociationsCondition, (err, results) => {
    if (err) {
      console.error('Error deleting associations:', err);
      return res.status(500).json({ error: 'Failed to delete associations.' });
    }

    // Now delete the package
    const deleteSetCondition = `pk_id = '${id}'`; // Changed id to pk_id

    db.deleteData('package', deleteSetCondition, (err, results) => {
      if (err) {
        console.error('Error deleting package:', err);
        return res.status(500).json({ error: 'Failed to delete package.' });
      }

      console.log('package and its associations deleted successfully!');
      res.status(200).json({ message: 'package and its associations deleted successfully.' });
    });
  });
});
// Get single package by ID
// router.get('/single/:id', function (req, res, next) {
//   const id = req.params.id;
//   const where = `package.pk_id='${id}'`; // Changed id to pk_id

//   const tables = `
//     package
//     LEFT JOIN pk_service_association ON package.pk_id = pk_service_association.association_pk_fk
//     LEFT JOIN service ON pk_service_association.association_service_fk = service.service_id
//   `;
//   const fields = `
//     package.pk_id,
//     package.pk_code,
//     package.pk_name,
//     GROUP_CONCAT(service.service_name) AS service_names
//   `;

//   db.selectData(tables, fields, where, (err, results) => {
//     if (err || !results.length) {
//       console.error('Error fetching package data:', err);
//       return res.status(500).json({ error: 'Failed to fetch package data.' });
//     }

//     res.status(200).json(results);
//   });
// });

// Get all active packages
router.get('/', function (req, res, next) {
    const tables = `package
      LEFT JOIN pk_service_association ON package.pk_id = pk_service_association.association_pk_fk 
      LEFT JOIN set_product ON package.set_id_fk = set_product.set_id 
      LEFT JOIN service ON pk_service_association.association_service_fk = service.service_id 
      GROUP BY package.pk_id`;
  
    const fields = `
      package.pk_id,
      package.pk_code,
      package.pk_name,
      package.pk_price, 
      package.set_id_fk,
      package.pk_images,
      pk_service_association.association_id,
      pk_service_association.association_pk_fk,
      set_product.set_name,
      GROUP_CONCAT(pk_service_association.association_service_fk) AS association_service_fk,
      GROUP_CONCAT(service.service_name) AS service_names
    `;
  
    db.selectData(tables, fields, (err, results) => {
      if (err) {
        console.error('Error fetching packages:', err);
        return res.status(400).send();
      }
      results.forEach(row => {
        row.association_service_fk = row.association_service_fk.split(','); // Split the string into an array
      });
      res.status(200).json(results);
    });
  });
  
module.exports = router;