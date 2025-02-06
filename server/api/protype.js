const express = require('express');
const db = require('../controller/controller.connection');
const router = express.Router();

// Get all product types
router.get("/", function (req, res) {
    db.selectAll('product_type', (err, results) => {
        if (err) {
            return res.status(400).json({ error: 'ການສະແດງຂໍ້ມູນລົ້ມເຫຼວ' });
        }
        res.status(200).json(results);
    });
});

// Get single product type by ID
router.get("/:protype_id", function (req, res) {
    const protype_id = req.params.protype_id;
    const where = `id=${protype_id}`;

    db.singleAll('product_type', where, (err, results) => {
        if (err) {
            return res.status(400).json({ error: 'ການສະແດງຂໍ້ມູນບໍ່ສຳເລັດ' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;