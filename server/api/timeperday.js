const express = require('express');
const db = require('../controller/controller.connection');
const router = express.Router();

router.get("/", function (req, res) {
    db.selectAll('time_per_day',(err, results) => {
        if (err) {
            return res.status(400).send('ການສະແດງຂໍ້ມູນລົມເຫຼວ');
        }
        res.status(200).json(results);
    });
});
router.get("/:id", function (req, res) {
    const id= req.params.id;
    const where=`id=${id}`;
    db.singleAll('time_per_day', where,(err, results) => {
        if (err) {
            return res.status(400).send();
        }
        res.status(200).json(results);
    });
});

router.get("/:id", function (req, res) {
  const id = req.params.id;
  const where=`id=${id}`;
  db.singleAll('time_per_day', where,(err, results) => {
      if (err) {
          return res.status(400).send();
      }
      res.status(200).json(results);
  });
});
 
  module.exports = router;