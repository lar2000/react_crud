const express=require('express');
const district = express.Router();
const db = require('../controller/controller.connection');

district.get("/", function (req, res) {
    db.selectAll('tbl_district',(err, results) => {
        if (err) {
            return res.status(400).send('ການສະແດງຂໍ້ມູນລົມເຫຼວ');
        }
        res.status(200).json(results);
    });
});

district.patch("/", function (req, res) {
    db.selectAll('tbl_district',(err, results) => {
        if (err) {
            return res.status(400).send('ການສະແດງຂໍ້ມູນລົມເຫຼວ');
        }
        res.status(200).json(results);
    });
});

district.get("/:id", function (req, res) {
    const id= req.params.id;
    const where=`district_id=${id}`;
    db.singleAll('tbl_district', where,(err, results) => {
        if (err) {
            return res.status(400).send();
        }
        res.status(200).json(results);
    });
});

district.get("/pv/:id", function (req, res) {
    const pvid= req.params.id;
    const where=`province_id_fk='${pvid}'`;
    db.selectWhere('tbl_district', '*', where,(err, results) => {
        if (err) {
        return res.status(400).send(err);
        }
        res.status(200).json(results);
    });
});

module.exports=district