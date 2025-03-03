const express = require('express');
const db = require('../controller/controller.connection');
const router = express.Router();

router.post('/create', function (req, res) {
  const { roomtype_id, roomtype_name, room_price, detail } = req.body;
  const table = 'room_type';

  // Auto-generate room_type ID if it doesn't exist
  if (!roomtype_id) {
    db.autoId(table, 'roomtype_id', (err, id) => {
      if (err) {
        console.error('Error generating room_type ID:', err);
        return res.status(500).json({ error: 'Failed to generate room_type ID.' });
      }

      const code = id.toString().slice(-4).padStart(4, '0');
      const roomtypeCode = 'RT-' + code;
      const fields = 'roomtype_id, roomtype_code, roomtype_name, room_price, detail';
      const dataValue = [id, roomtypeCode, roomtype_name, room_price, detail];

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting room_type:', err);
          return res.status(500).json({ error: 'Failed to add room_type.' });
        }
        console.log('room_type added successfully!');
        return res.status(200).json({ message: 'room_type added successfully.', room_type: dataValue });
      });
    });
  } else {
    // Update existing room_type
    const where = `roomtype_id = '${roomtype_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('room_type not found:', err);
        return res.status(500).json({ error: 'Failed to fetch room_type data.' });
      }

      const fields = 'roomtype_name, room_price, detail';
      const newData = [roomtype_name, room_price, detail, roomtype_id];
      const condition = 'roomtype_id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating room_type:', err);
          return res.status(500).json({ error: 'Failed to update room_type.' });
        }
        res.status(200).json({ message: 'room_type updated successfully', data: results });
      });
    });
  }
});

router.delete("/:roomtype_id", function (req, res, next) {
  const roomtype_id = req.params.roomtype_id;
  const where = `roomtype_id='${roomtype_id}'`;

  db.deleteData('room_type', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
    }
    res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});

router.get("/single/:roomtype_id", function (req, res, next) {
  const roomtype_id = req.params.roomtype_id;
  const where = `roomtype_id='${roomtype_id}'`;
  const table = 'room_type';

  db.singleAll(table, where, (err, results) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to retrieve data.' });
    }
    res.status(200).json(results);
  });
});

router.get("/", function (req, res, next) {
  const table = 'room_type';

  db.selectAll(table, (err, results) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to retrieve data.' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;