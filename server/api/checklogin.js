const express = require('express');
const router = express.Router();
const db = require('../controller/controller.connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

router.post("/", function(req, res) {
    const password = req.body.password; 
    const email = req.body.email;
    const table = `staff`; 
    const fields = `staff_id, staff_code, staffName, email, password, staff_status`; 
    const where = `state='1' AND email='${email}'`;

    db.fetchSingle(table, fields, where, (err, results) => {
        if (err || !results) {
            return res.status(400).json({
                status: "400",
                message: "ຊື່ອີເມວບໍ່ຖືກຕ້ອງ"
            });
        }

        bcrypt.compare(password, results.password, (bcryptErr, bcryptResult) => {
            if (bcryptErr || !bcryptResult) {
                return res.status(400).json({
                    status: "400",
                    message: "ຫັດຜ່ານບໍ່ຖືກຕ້ອງ"
                });
            }

            const dateTime = new Date().toISOString(); // Ensure this is defined

            const payload = {
                staff_id: results.staff_id,
                email: results.email,
                create_date: dateTime
            };

            jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' }, (signErr, token) => {
                if (signErr) {
                    return res.status(500).json({
                        status: "500",
                        message: "ເຊີບເວີພາຍໃນມີການຜິດພາດ"
                    });
                }

                res.status(200).json({
                    status: "200",
                    message: "ການເຂົ້າສູ້ລະບົບສຳເລັດແລ້ວ",
                    token: token,
                    staff_id: results.staff_id,
                    staff_code: results.staff_code,
                    email: results.email,
                    staffName: `${results.staff_name} ${results.staff_surname}`,
                });
            });
        });
    });
});


router.post("/authen", function(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: "401",
            message: "Authorization token is missing or invalid"
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (verifyErr, decoded) => {
        if (verifyErr) {
            return res.status(401).json({
                status: "401",
                message: "Invalid token"
            });
        }

        const userId = decoded.staff_id;
        const email = decoded.email;
        
        res.status(200).json({
            status: 'OK',
            userId: userId,
            email: email
        });
    });
});
module.exports = router;