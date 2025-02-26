const express=require('express');
const router = express.Router();
const db = require('../controller/controller.connection');

router.get("/", function (req, res) {
    db.selectAll('authen_actions',(err, results) => {
        if (err) {
            return res.status(400).send('ການສະແດງຂໍ້ມູນລົມເຫຼວ');
        }
        res.status(200).json(results);
    });
});

module.exports = router;