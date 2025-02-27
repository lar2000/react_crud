const express = require('express');
const router = express.Router();
const db = require('../controller/controller.connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app_secret = process.env.APP_SECRET || "APP_SECRET_CHECK_V01";

router.post("/", (req, res) => {
    const { email, password } = req.body;
    const table = `staff LEFT JOIN staff_authen_association ON staff.staff_id=staff_authen_association.staff_fk`;
    const fields = `
    staff_id, 
    staff_code, 
    staff_name, 
    staff_surname, 
    email, password, 
    staff_status,
    COALESCE(GROUP_CONCAT(DISTINCT staff_authen_association.authen_fk), '') AS authen_fk
    `;
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

            const dateTime = new Date().toISOString(); 
            
            const payload = { 
                staff_id: results.staff_id,
                 email: results.email, 
                 create_at: dateTime
                 };

            jwt.sign(payload, app_secret, { expiresIn: '12h' }, (signErr, token) => {
                if (signErr) return res.status(500).json({ 
                    status: "500", 
                    message: "Server Error" 
                });

                res.status(200).json({
                    status: "200",
                    message: "Login Successful",
                    token,
                    staff_id: results.staff_id,
                    staff_code: results.staff_code,
                    email: results.email,
                    staff_status: results.staff_status,
                    authen_fk: results.authen_fk,
                    staffName: `${results.staff_name} ${results.staff_surname}`,
                });
            });
        });
    });
});

router.post("/authen", (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ 
        status: "401", 
        message: "Token is missing" 
    });

    jwt.verify(token, app_secret, (err, decoded) => {
        if (err) return res.status(401).json({ 
            status: "401", 
            message: "Invalid token" 
        });

        res.status(200).json({ 
            status: 'OK', 
            userId: decoded.staff_id, 
            email: decoded.email 
        });
    });
});

module.exports = router;
