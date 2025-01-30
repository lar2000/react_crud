const express = require('express');
const multer = require('multer');
const path = require('path');
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
      cb(null, image);
    }
  });
  const upload = multer({ storage }).single('image');

  upload(req, res, function (err) {
    const {_id, pro_name, size, amount, unit_fk, protype_id_fk, price } = req.body;
    const total = amount * price;
    const table = 'product';
    
    if (!_id) {
      db.autoId(table, 'pro_id', (err, pro_id) => {
        const code = pro_id.toString().slice(-4).padStart(4, '0');
        const pro_code = 'ST-' + code;
        const Fields = 'pro_id, pro_code, pro_name, size, amount, unit_fk, protype_id_fk, price, total, image';
        const dataValue = [pro_id, pro_code, pro_name, size, amount, unit_fk, protype_id_fk, price, total, image];

        db.insertData(table, Fields, dataValue, (err, results) => {
          if (err) {
            console.error('Error Inserting Data: ', err);
            return res.status(500).json({ error: 'ການບັນທຶກຂໍ້ມູນຫລົ້ມເຫຼວ' });
          }
          console.log('Data inserted successfully!', results);
          return res.status(200).json({ message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ: ', dataValue });
        });
      });
    } else {
      const where = `pro_id = '${_id}'`;

      db.selectWhere(table, '*', where, (err, results) => {
        if (err || !results.length) {
          console.error('Error fetching data:', err);
          return res.status(500).json({ error: 'Failed to fetch existing record' });
        }

        if (results[0].image && image) {
          const filePath = path.resolve('./uploads/images', results[0].image);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting old file:', err);
            }
          });
        }

        const updatedimage = image || results[0].image;
        const updatedTotal = amount * price;
        const fields = 'pro_name, size, amount, unit_fk, protype_id_fk, price, total, image';
        const newData = [pro_name, size, amount, unit_fk, protype_id_fk, price, updatedTotal, updatedimage, _id];
        const condition = 'pro_id=?';

        db.updateData(table, fields, newData, condition, (err, results) => {
          if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ error: 'Failed to update product' });
          }
          res.status(200).json({ message: 'Product updated successfully', data: results });
        });
      });
    }
  });
});

router.delete('/:pro_id', function (req, res, next) {
  const pro_id = req.params.pro_id;
  const where = `pro_id='${pro_id}'`;
  db.deleteData('product', where, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
      }
      res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});

router.get('/single/:pro_id', function (req, res, next) {
  const pro_id = req.params.pro_id;
  const where = `pro_id='${pro_id}'`;
  const tables = `product`;
  db.singleAll(tables, where, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});

router.get('/', function (req, res, next) {
  const tables = `product
       LEFT JOIN product_type ON product.protype_id_fk=product_type.protype_id 
       LEFT JOIN unit ON product.unit_fk=unit.id`;

  const fields = `
      product.pro_id,
      product.pro_code, 
      product.pro_name, 
      product.size, 
      product.amount, 
      product.protype_id_fk, 
      product.unit_fk, 
      product.image, 
      product.price,  
      product.total,
      product_type.protype_name,
      unit.name`;

  db.selectData(tables, fields, (err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});

module.exports = router;