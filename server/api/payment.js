const express = require('express');
const db = require('../controller/controller.connection');
const router = express.Router();

const table = 'payment';

router.post('/create', function (req, res) {
  let { pay_id, pay_status, calculation, get_money, pay_date} = req.body;

  if (get_money == 0) {
    pay_status = 0;
  } else if (get_money === calculation) {
    pay_status = 2;
  } else if (get_money < calculation) {
      pay_status = 1;
  }
  // Auto-generate payment ID if it doesn't exist
  if (!pay_id) {
    db.autoId(table, 'pay_id', (err, pay_id) => {
      if (err) {
        console.error('Error generating payment ID:', err);
        return res.status(500).json({ error: 'Failed to generate payment ID.' });
      }

      const code = pay_id.toString().slice(-4).padStart(4, '0');
      const payCode = 'PAY-' + code;
      const fields = 'pay_id, pay_status, pay_code, calculation, get_money, pay_date, state';
      const dataValue = [pay_id, pay_status, payCode, calculation, get_money, pay_date, 1];

      db.insertData(table, fields, dataValue, (err, results) => {
        if (err) {
          console.error('Error inserting payment:', err);
          return res.status(500).json({ error: 'Failed to add payment.' });
        }
        console.log('payment added successfully!');
        return res.status(200).json({ message: 'payment added successfully.', payment: dataValue });
      });
    });
  } else {
    // Update existing payment
    const where = `pay_id = '${pay_id}'`;

    db.selectWhere(table, '*', where, (err, results) => {
      if (err || !results.length) {
        console.error('payment not found:', err);
        return res.status(500).json({ error: 'Failed to fetch payment data.' });
      }

      const fields = 'pay_status, calculation, get_money, pay_date';
      const newData = [pay_status, calculation, get_money, pay_date, pay_id];
      const condition = 'pay_id=?';

      db.updateData(table, fields, newData, condition, (err, results) => {
        if (err) {
          console.error('Error updating payment:', err);
          return res.status(500).json({ error: 'Failed to update payment.' });
        }
        res.status(200).json({ message: 'payment updated successfully', data: results });
      });
    });
  }
});

router.patch('/:pay_fk', function (req, res, next) {
  const pay_fk = req.params.pay_fk;
  const fields = 'state';
  const newData = [0];
  const condition = `pay_id='${pay_fk}'`;

  db.updateData('payment', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate payment' });
    }
    res.status(200).json({ message: 'Payment deactivated successfully', data: results });
  });
});

router.delete("/:pay_fk", function (req, res, next) {
  const pay_fk = req.params.pay_fk;
  const where = `pay_id='${pay_fk}'`;

  db.deleteData('payment', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'ຂໍອະໄພການລືບຂໍ້ມູນບໍ່ສຳເລັດ' });
    }
    res.status(200).json({ message: 'ການດຳເນີນງານສຳເລັດແລ້ວ', data: results });
  });
});

router.get("/single/:pay_id", function (req, res, next) {
  const pay_id = req.params.pay_id;
  const where = `pay_id='${pay_id}'`;

  db.singleAll(table, where, (err, results) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to retrieve data.' });
    }
    res.status(200).json(results);
  });
});

router.get("/paytype", function (req, res, next) {
    db.selectAll('payment_type', (err, results) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to retrieve data.' });
      }
      res.status(200).json(results);
    });
  });

router.get('/', function (req, res, next) {
  const tables = 'payment';
  const fields = 'pay_id, pay_status, book_id_fk, pay_code, calculation, get_money, pay_date';
  const where = 'state = 1';
  db.selectWhere(tables, fields, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});

module.exports = router;