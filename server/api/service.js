const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('./db_connection');
const router = express.Router();

router.post('/create', function (req, res) {
  const {_id, servicetype_id_fk, set_id_fk, service_name } = req.body;
  const table = 'service';
  
  // Auto-generate service ID if it doesn't exist
  if (!_id) {
    db.autoId(table, 'id', (err, id) => {
      const code = id.toString().slice(-4).padStart(4, '0');
      const serviceId = 'SV-' + code;
      const fields = 'id, service_id, servicetype_id_fk, set_id_fk, service_name';
      const dataValue = [id, serviceId, servicetype_id_fk, set_id_fk, service_name]; // Default state to 1 (active)

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting service:', err);
          return res.status(500).json({ error: 'Failed to add service.' });
        }
        console.log('service added successfully!');
        return res.status(200).json({ message: 'service added successfully.', service: dataValue });
      });
    });
  } else {
    // Update existing service
    const where = `id = '${_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('service not found:', err);
        return res.status(500).json({ error: 'Failed to fetch service data.' });
      }

      const fields = 'servicetype_id_fk, set_id_fk, service_name';
      const newData = [servicetype_id_fk, set_id_fk, service_name, _id];
      const condition = 'id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating service:', err);
          return res.status(500).json({ error: 'Failed to update service.' });
        }
        res.status(200).json({ message: 'service updated successfully', data: results });
      });
    });
  }
});

// router.patch('/:id', function (req, res, next) {
//   const id = req.params.id;
//   const fields = 'state';
//   const newData = [0, id];
//   const condition = 'id=?';

//   db.updateData('service', fields, newData, condition, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to deactivate service' });
//     }
//     res.status(200).json({ message: 'service deactivated successfully', data: results });
//   });
// });

router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  db.deleteData('service', where, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
      }
      res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});

router.get("/single/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  const tables = `service`;
  db.singleAll(tables, where, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});
router.get("/", function (req, res, next) {
  const tables = `service
       LEFT JOIN set_product ON service.set_id_fk=set_product.id
       LEFT JOIN service_type ON service.servicetype_id_fk=service_type.id `;

  const fields = `
      service.id,
      service.service_id,
      service.servicetype_id_fk, 
      service.set_id_fk, 
      service.service_name, 
      set_product.set_name,
      service_type.servicetype_name`;

  db.selectData(tables, fields, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});
module.exports = router;
