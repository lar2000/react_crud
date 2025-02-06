const express = require('express');
const db = require('../controller/controller.connection');
const router = express.Router();

router.post('/create', function (req, res) {
  const { servicetype_id, servicetype_name, detail } = req.body;
  const table = 'service_type';

  // Auto-generate service_type ID if it doesn't exist
  if (!servicetype_id) {
    db.autoId(table, 'servicetype_id', (err, id) => {
      if (err) {
        console.error('Error generating service_type ID:', err);
        return res.status(500).json({ error: 'Failed to generate service_type ID.' });
      }

      const code = id.toString().slice(-4).padStart(4, '0');
      const servicetype_code = 'SVT-' + code;
      const fields = 'servicetype_id, servicetype_code, servicetype_name, detail';
      const dataValue = [id, servicetype_code, servicetype_name, detail];

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
    const where = `servicetype_id = '${servicetype_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('service_type not found:', err);
        return res.status(500).json({ error: 'Failed to fetch service_type data.' });
      }

      const fields = 'servicetype_name, detail';
      const newData = [servicetype_name, detail, servicetype_id];
      const condition = 'servicetype_id=?';

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

router.delete("/:servicetype_id", function (req, res, next) {
  const servicetype_id = req.params.servicetype_id;
  const where = `servicetype_id='${servicetype_id}'`;

  db.deleteData('service_type', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
    }
    res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});

router.get("/single/:servicetype_id", function (req, res, next) {
  const servicetype_id = req.params.servicetype_id;
  const where = `servicetype_id='${servicetype_id}'`;
  const table = 'service_type';

  db.singleAll(table, where, (err, results) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to retrieve data.' });
    }
    res.status(200).json(results);
  });
});

router.get("/", function (req, res, next) {
  const table = 'service_type';

  db.selectAll(table, (err, results) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to retrieve data.' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;