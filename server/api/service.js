const express = require('express');
const db = require('../controller/controller.connection');
const router = express.Router();

router.post('/create', function (req, res) {
  const { _id, servicetype_id_fk, service_name} = req.body;
  const table = 'service';

  // Auto-generate service_code if it doesn't exist
  if (!_id) {
    db.autoId(table, 'service_id', (err, id) => {
      const code = id.toString().slice(-4).padStart(4, '0');
      const serviceCode = 'SV-' + code;
      const fields = 'service_id, service_code, servicetype_id_fk, service_name';
      const dataValue = [id, serviceCode, servicetype_id_fk, service_name];

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting service:', err);
          return res.status(500).json({ error: 'Failed to add service.' });
        }
        console.log('Service added successfully!');
        return res.status(200).json({ message: 'Service added successfully.', service: dataValue });
      });
    });
  } else {
    const where = `service_id = '${_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('Service not found:', err);
        return res.status(500).json({ error: 'Failed to fetch service data.' });
      }

      const fields = 'servicetype_id_fk, service_name';
      const newData = [servicetype_id_fk, service_name, _id];
      const condition = 'service_id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating service:', err);
          return res.status(500).json({ error: 'Failed to update service.' });
        }
        res.status(200).json({ message: 'Service updated successfully', data: results });
      });
    });
  }
});

router.delete("/:id", function (req, res) {
  const id = req.params.id;
  const where = `service_id='${id}'`;
  db.deleteData('service', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
    }
    res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});

router.get("/single/:id", function (req, res) {
  const id = req.params.id;
  const where = `service_id='${id}'`;
  const tables = `service`;
  db.singleAll(tables, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

router.get("/ByTypeId", function (req, res) {
  const tables = `service
       LEFT JOIN service_type ON service.servicetype_id_fk = service_type.servicetype_id`;

  const fields = `
      service.servicetype_id_fk, 
      service_type.servicetype_name, 
      GROUP_CONCAT(service.service_id) AS service_ids,
      GROUP_CONCAT(service.service_name) AS service_names`;
      
  const groupBy = `GROUP BY service.servicetype_id_fk`;

  db.selectData(`${tables} ${groupBy}`, fields, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    // Convert service_ids and service_names from comma-separated strings to arrays
    results.forEach(result => {
      result.service_ids = result.service_ids.split(',').map(Number); // Convert service_ids to an array of numbers
      result.service_names = result.service_names.split(','); // Convert service_names to an array of strings
    });
    res.status(200).json(results);
  });
});


router.get("/", function (req, res) {
  const tables = `service
       LEFT JOIN service_type ON service.servicetype_id_fk = service_type.servicetype_id`;

  const fields = `
      service.service_id,
      service.service_code,
      service.servicetype_id_fk, 
      service.service_name, 
      service_type.servicetype_name`;

  db.selectData(tables, fields, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

module.exports = router;