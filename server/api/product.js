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
  let image = null;
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/images');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      image = `pd-${Date.now()}${ext}`;
      cb(null, image)
    }
  });
  const upload = multer({ storage }).single('image');
  
  upload(req, res, function (err) {

   // const productPass = bcrypt.hashSync(req.body.productPass);
    const {_id, pro_name, size, amount, protype_id_fk, price, total } = req.body;
    const table = 'product';
    if(!_id) {
     
      db.autoId(table, 'id', (err, id) => {
        const code = id.toString().slice(-4).padStart(4, '0');
        const productId = 'ST-' + code;
        const Fields = 'id, pro_id, pro_name, size, amount, protype_id_fk, price, total, image, state';
        const dataValue = [id, productId, pro_name, size, amount, protype_id_fk, price, total,  image, 1];

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

        // Delete old image if a new one is uploaded
        if (results[0].image && image) {
          const filePath = path.resolve('./uploads/images', results[0].image);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting old file:', err);
            }
          });
        }
        const updatedimage = image || results[0].image;
        const fields = 'pro_name, size, amount, protype_id_fk, price, total, image';
        const newData = [pro_name, size, amount, protype_id_fk, price, total, updatedimage, _id];
        const condition = 'id=?';

        db.updateData(table, fields, newData, condition, (err, results) => {
          if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ error: 'Failed to update product' });
          }
          res.status(200).json({ message: 'product updated successfully', data: results });
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

  db.updateData('product', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate product' });
    }
    res.status(200).json({ message: 'product deactivated successfully', data: results });
  });
});
// router.post('/edituse', function (req, res) {
//   const userPassword = bcrypt.hashSync(req.body.userPassword);
//   const { productId, building_id_fk, statusUse, useramount, typeUser } = req.body;
//   const filedEdit = `building_id_fk,statusUse,useramount,userPassword,typeUser`;
//   const newData = [building_id_fk, statusUse, useramount,userPassword, typeUser, productId];
//   const condition = 'pro_id=?';
//   db.updateData('tbl_product', filedEdit, newData, condition, (err, results) => {
//       if (err) {
//           return res.status(500).json({ error: 'ການແກ້ໄຂລະຫັດຜ່ານບໍ່ສຳເລັດແລ້ວ' });
//       }
//       res.status(200).json({ message: 'ການແກ້ໄຂລະຫັດຜ່ານສຳເລັດແລ້ວ'});
//   });
// })
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  db.deleteData('product', where, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
      }
      res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});



router.get("/single/:id", function (req, res, next) {
  const id = req.params.id;
  const where = `id='${id}'`;
  const tables = `product`;
  db.singleAll(tables, where, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});
router.get("/", function (req, res, next) {
  const tables = `product
       LEFT JOIN product_type ON product.protype_id_fk=product_type.id`;

  const fields = `
      product.id,
      product.pro_id, 
      product.pro_name, 
      product.size, 
      product.amount, 
      product.protype_id_fk, 
      product.image, 
      product.price,  
      product.total,
      product_type.protype_name`;

  db.selectData(tables, fields, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});
module.exports = router;
