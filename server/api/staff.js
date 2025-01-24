const express = require('express');
const multer = require('multer');
const path = require('path');
//const bcrypt = require('bcryptjs');
//const currentDatetime = moment();
//const dateNow = currentDatetime.format('YYYY-MM-DD');
const fs = require('fs');
const db = require('./db_connection');
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

   // const staffPass = bcrypt.hashSync(req.body.staffPass);
    const {_id, staff_name, staff_surname, email, tell, village, district_fk } = req.body;
    const table = 'staff';
    if(!_id) {
     
      db.autoId(table, 'id', (err, id) => {
        const code = id.toString().slice(-4).padStart(4, '0');
        const staffId = 'ST-' + code;
        const Fields = 'id, staff_id, staff_name, staff_surname, email, tell, village, district_fk, profile, state';
        const dataValue = [id, staffId, staff_name, staff_surname, email, tell, village, district_fk,  profile, 1];

        db.insertData(table, Fields, dataValue, (err, results) => {
          if (err) {
            console.error('Error Inerting Data: ', err);
            return res.status(500).json({ error: `ການບັນທຶກຂໍ້ມູນຫລົ້ມເຫຼວ` });
          }
          console.log( 'Data inserted successfully!', results);
          return res.status(200).json({ message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ: ',dataValue}); 
        })
      })
    } else {

      const where = `id = '${_id}'`;

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
        const fields = 'staff_name, staff_surname, email, tell, village, district_fk, profile';
        const newData = [staff_name, staff_surname, email, tell, village, district_fk, updatedProfile, _id];
        const condition = 'id=?';

        db.updateData(table, fields, newData, condition, (err, results) => {
          if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ error: 'Failed to update staff' });
          }
          res.status(200).json({ message: 'Staff updated successfully', data: results });
        });
      });
    } 
  })
});

router.patch('/:id', function (req, res, next) {
  const id = req.params.id;
  const fields = 'state';
  const newData = [0, id];
  const condition = 'id=?';

  db.updateData('staff', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate staff' });
    }
    res.status(200).json({ message: 'Staff deactivated successfully', data: results });
  });
});
// router.post('/edituse', function (req, res) {
//   const userPassword = bcrypt.hashSync(req.body.userPassword);
//   const { staffId, building_id_fk, statusUse, userEmail, typeUser } = req.body;
//   const filedEdit = `building_id_fk,statusUse,userEmail,userPassword,typeUser`;
//   const newData = [building_id_fk, statusUse, userEmail,userPassword, typeUser, staffId];
//   const condition = 'staff_id=?';
//   db.updateData('tbl_staff', filedEdit, newData, condition, (err, results) => {
//       if (err) {
//           return res.status(500).json({ error: 'ການແກ້ໄຂລະຫັດຜ່ານບໍ່ສຳເລັດແລ້ວ' });
//       }
//       res.status(200).json({ message: 'ການແກ້ໄຂລະຫັດຜ່ານສຳເລັດແລ້ວ'});
//   });
// })
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  db.deleteData('staff', where, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
      }
      res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});



router.get("/single/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
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
      staff.id,
      staff.staff_id, 
      staff.staff_name, 
      staff.staff_surname, 
      staff.email, 
      staff.tell, 
      staff.profile, 
      staff.village,  
      staff.district_fk,
      tbl_district.province_id_fk,
      tbl_district.district_name, 
      tbl_province.province_name`;
      const wheres=`staff.state = 1`;

  db.selectWhere(tables, fields, wheres, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});
module.exports = router;