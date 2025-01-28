const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('./db_connection');
const router = express.Router();

router.post('/create', function (req, res) {
  const {_id, servicetype_name, detail } = req.body;
  const table = 'service_type';
  
  // Auto-generate service_type ID if it doesn't exist
  if (!_id) {
    db.autoId(table, 'id', (err, id) => {
      const code = id.toString().slice(-4).padStart(4, '0');
      const servicetypeId = 'SVT-' + code;
      const fields = 'id, servicetype_id, servicetype_name, detail';
      const dataValue = [id, servicetypeId, servicetype_name, detail]; // Default state to 1 (active)

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting service_type:', err);
          return res.status(500).json({ error: 'Failed to add service_type.' });
        }
        console.log('service_type added successfully!');
        return res.status(200).json({ message: 'service_type added successfully.', service_type: dataValue });
      });
    });
  } else {
    // Update existing service_type
    const where = `id = '${_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('service_type not found:', err);
        return res.status(500).json({ error: 'Failed to fetch service_type data.' });
      }

      const fields = 'servicetype_name, detail';
      const newData = [servicetype_name, detail, _id];
      const condition = 'id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating service_type:', err);
          return res.status(500).json({ error: 'Failed to update service_type.' });
        }
        res.status(200).json({ message: 'service_type updated successfully', data: results });
      });
    });
  }
});

// router.patch('/:id', function (req, res, next) {
//   const id = req.params.id;
//   const fields = 'state';
//   const newData = [0, id];
//   const condition = 'id=?';

//   db.updateData('service_type', fields, newData, condition, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to deactivate service_type' });
//     }
//     res.status(200).json({ message: 'service_type deactivated successfully', data: results });
//   });
// });

router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  db.deleteData('service_type', where, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
      }
      res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});

router.get("/single/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  const tables = `service_type`;
  db.singleAll(tables, where, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});
router.get("/", function (req, res, next) {
  const tables = `service_type`

  db.selectAll(tables, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});
module.exports = router;
