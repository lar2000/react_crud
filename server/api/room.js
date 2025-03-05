const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../controller/controller.connection');
const router = express.Router();

router.post('/create', function (req, res) {
  let image = null;
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/roomIMG');
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        image = `R-${Date.now()}${ext}`;
        cb(null, image);
      }
    });
    const upload = multer({ storage }).single('image');
  
    upload(req, res, function (err) {
  const { _id, room_number, roomtype_fk } = req.body;
  const table = 'room';

  // Auto-generate room_code if it doesn't exist
  if (!_id) {
    db.autoId(table, 'room_id', (err, id) => {
      const fields = 'room_id, room_number, roomtype_fk, status, room_img';
      const dataValue = [id, room_number, roomtype_fk, 0, image];

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting room:', err);
          return res.status(500).json({ error: 'Failed to add room.' });
        }
        console.log('room added successfully!');
        return res.status(200).json({ message: 'room added successfully.', room: dataValue });
      });
    });
  } else {
    // Update existing room
    const where = `room_id = '${_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('room not found:', err);
        return res.status(500).json({ error: 'Failed to fetch room data.' });
      }

      if (results[0].image && image) {
        const filePath = path.resolve('./uploads/roomIMG', results[0].image);
          fs.unlink(filePath, (err) => {
            if (err) {
               console.error('Error deleting old file:', err);
            }
          });
      }
      const updatedimage = image || results[0].image;
      const fields = 'room_number, roomtype_fk, room_img';
      const newData = [room_number, roomtype_fk, updatedimage, _id];
      const condition = 'room_id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating room:', err);
          return res.status(500).json({ error: 'Failed to update room.' });
        }
        res.status(200).json({ message: 'room updated successfully', data: results });
      });
    });
  }
});
});

router.delete("/:id", function (req, res) {
  const id = req.params.id;
  const where = `room_id='${id}'`;
  db.deleteData('room', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
    }
    res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});

router.get("/single/:id", function (req, res) {
  const id = req.params.id;
  const where = `room_id='${id}'`;
  const tables = `room`;
  db.singleAll(tables, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

router.get("/", function (req, res) {
  const tables = `room
       LEFT JOIN room_type ON room.roomtype_fk = room_type.roomtype_id`;

  const fields = `
      room.room_id,
      room.room_number,
      room.roomtype_fk,
      room.status,
      room.room_img,
      room_type.roomtype_name
      `;

  db.selectData(tables, fields, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

module.exports = router;