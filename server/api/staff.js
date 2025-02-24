const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const db = require('../controller/controller.connection');
const moment = require('moment')
//const currentDatetime = moment();
const dateNow = moment().format('YYYY-MM-DD HH:mm:ss'); // Correct format for MySQL
const router = express.Router();

router.post('/create', function (req, res) {
  let profile = null;
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/profiles');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      profile = `pf-${Date.now()}${ext}`;
      cb(null, profile)
    }
  });
  const upload = multer({ storage }).single('profile');
  
  upload(req, res, function (err) {
    const password = req.body.password ? bcrypt.hashSync(req.body.password) : null;
    const { _id, staff_name, staff_surname, email, tell, village, district_fk, staff_status} = req.body;
    const table = 'staff';
    if(!_id) {
      db.autoId(table, 'staff_id', (err, id) => {
        const code = id.toString().slice(-4).padStart(4, '0');
        const staffCode = 'ST-' + code;
        const Fields = 'staff_id, staff_code, staff_name, staff_surname, email, password, tell, village, district_fk, profile, staff_status, state, datetime'; // Changed 'id' to 'staff_id' and 'staff_id' to 'staff_code'
        const dataValue = [id, staffCode, staff_name, staff_surname, email, password, tell, village, district_fk, profile, staff_status, 1, dateNow]; // Changed 'staff_id' to 'staff_code'

        db.insertData(table, Fields, dataValue, (err, results) => {
          if (err) {
            console.error('Error Inserting Data: ', err);
            return res.status(500).json({ error: `ການບັນທຶກຂໍ້ມູນຫລົ້ມເຫຼວ` });
          }
          console.log('Data inserted successfully!', results);
          return res.status(200).json({ message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ: ', dataValue });
        })
      })
    } else {
      const where = `staff_id = '${_id}'`; // Changed from 'id' to 'staff_id'

      db.selectWhere(table, '*', where, (err, results) => {
        if (err || !results.length) {
          console.error('Error fetching data:', err);
          return res.status(500).json({ error: 'Failed to fetch existing record' });
        }

        // Delete old profile if a new one is uploaded
        if (results[0].profile && profile) {
          const filePath = path.resolve('./uploads/profiles', results[0].profile);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting old file:', err);
            }
          });
        }
        const updatedProfile = profile || results[0].profile;
        const normalizedStatus = String(staff_status).trim().toLowerCase(); // staff_status is String Only && ລົບຊ່ອງວ່າງອອກ
        const passwordToUpdate = (normalizedStatus === '0') ? null : password;
        console.log(staff_status);

        const fields = 'staff_name, staff_surname, email, password, tell, village, district_fk, profile, staff_status';
        const newData = [staff_name, staff_surname, email, passwordToUpdate, tell, village, district_fk, updatedProfile, staff_status, _id];
        const condition = 'staff_id=?';

        db.updateData(table, fields, newData, condition, (err, results) => {
          if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ error: 'Failed to update staff' });
          }
          res.status(200).json({ message: 'Staff updated successfully', data: newData });
        });
      });
    } 
  })
});

router.post('/changepass', function (req, res) {
  const newpass = bcrypt.hashSync(req.body.password);
  const { _id, email, staff_status } = req.body;
  const filedEdit = ` email, password, staff_status`;
  const newData = [email, newpass, staff_status, _id];
  const condition = 'staff_id=?';
  db.updateData('staff', filedEdit, newData, condition, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'ການແກ້ໄຂລະຫັດຜ່ານບໍ່ສຳເລັດ' });
      }
      res.status(200).json({ message: 'ການແກ້ໄຂລະຫັດຜ່ານສຳເລັດແລ້ວ'});
  });
})

router.patch('/:id', function (req, res, next) {
  const id = req.params.id;
  const fields = 'state';
  const newData = [0, id];
  const condition = 'staff_id=?'; // Changed from 'id' to 'staff_id'

  db.updateData('staff', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate staff' });
    }
    res.status(200).json({ message: 'Staff deactivated successfully', data: results });
  });
});

router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `staff_id='${id}'`; // Changed from 'id' to 'staff_id'
  db.deleteData('staff', where, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
      }
      res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});

router.get("/single/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `staff_id='${id}'`; // Changed from 'id' to 'staff_id'
  const tables = `staff`;
  db.singleAll(tables, where, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});

router.get("/", function (req, res, next) {
  const tables = `staff
       LEFT JOIN tbl_district ON staff.district_fk=tbl_district.district_id 
       LEFT JOIN tbl_province ON tbl_district.province_id_fk=tbl_province.province_id `;

  const fields = `
      staff.staff_id,
      staff.staff_code,
      staff.staff_name, 
      staff.staff_surname, 
      staff.email,
      staff.tell, 
      staff.profile, 
      staff.village,  
      staff.district_fk,
      staff.staff_status,
      tbl_district.province_id_fk,
      tbl_district.district_name, 
      tbl_province.province_name`;

  const wheres = `staff.state = 1`;

  db.selectWhere(tables, fields, wheres, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});

module.exports = router;
