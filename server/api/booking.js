const express = require('express');
const db = require('../controller/controller.connection');
const router = express.Router();
const datenow = new Date().toISOString(); 

// Helper function to update customer status
function updateCustomerStatus(cust_id_fk, status, callback) {
  const customerFields = 'status';
  const customerData = [status, cust_id_fk]; // Set the status value
  const customerCondition = 'cust_id = ?';
  db.updateData('customer', customerFields, customerData, customerCondition, callback);
}
function updateRoomStatus(room_fk, status, callback) {
  const roomFields = 'status';
  const roomData = [status, room_fk]; // Set the status value
  const roomCondition = 'room_id = ?';
  db.updateData('room', roomFields, roomData, roomCondition, callback);
}

router.post('/create', function (req, res) {
  const { book_id, cust_id_fk, pay_fk, pk_fk = [], room_fk= [], group_size, date, tell, email, note } = req.body;
  const table = 'booking';
  const group_type = group_size > 1 ? 'ກຸ່ມ' : 'ບຸກຄົນ';

  if (!Array.isArray(pk_fk) || !Array.isArray(room_fk)) {
    return res.status(400).json({ error: 'Both pk_fk and room_fk must be arrays.' });
  }  

  if (!book_id) {
    db.autoId(table, 'book_id', (err, id) => {
      if (err) return res.status(500).json({ error: 'Failed to generate booking ID.' });

      const book_code = 'B-' + id.toString().slice(-4).padStart(4, '0');
      const fields = 'book_id, book_code, cust_id_fk, pay_fk, group_type, date, group_size, tell, email, note, state, datenow';
      const dataValue = [id, book_code, cust_id_fk, pay_fk, group_type, date, group_size, tell, email, note, 1, datenow];

      db.insertData(table, fields, dataValue, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to add booking.' });

        if (pk_fk.length > 0) {
          pk_fk.forEach(pk_id => {
            const associationFields = 'book_association_fk, pk_association_fk';
            const associationData = [id, pk_id];
        
              db.insertData('bps_association', associationFields, associationData, (err, results) => {
                if (err) {
                  console.error('Error inserting bps_association:', err);
                }
              });
          });
        }
        if (room_fk.length > 0) {
          room_fk.forEach(room_id => {
            const associationFields = 'book_association_id, room_association_id';
            const associationData = [id, room_id];
        
              db.insertData('book_room_association', associationFields, associationData, (err, results) => {
                if (err) {
                  console.error('Error inserting bps_association:', err);
                }
                updateRoomStatus(room_id, 1, (err) => {
                  if (err) {
                    console.error('Error updating room status:', err);
                  }
                });
              });
          });
        }
        updateCustomerStatus(cust_id_fk, 1, (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update customer status.' });

          res.status(200).json({ message: 'Booking added successfully.', booking: dataValue });
        });
      });
    });
  } else {
    // Fetch existing cust_id_fk before updating
    const where = `book_id='${book_id}'`; 

    db.selectWhere(table, 'cust_id_fk', where, (err, results) => {
      if (err || !results.length) 
        return res.status(500).json({ error: 'Failed to fetch booking data.' });

      const old_cust_id_fk = results[0].cust_id_fk;
      updateCustomerStatus(old_cust_id_fk, 0, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to update old customer status.' });

        const fields = 'cust_id_fk, pay_fk, group_type, date, group_size, tell, email, note, datenow';
        const newData = [cust_id_fk, pay_fk, group_type, date, group_size, tell, email, note, datenow, book_id];
        const condition = 'book_id=?';

        db.updateData(table, fields, newData, condition, (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update booking.' });

          const deleteConditionBPS = `book_association_fk = (SELECT book_id FROM ${table} WHERE book_id = '${book_id}')`;
          const deleteConditionBR = `book_association_id = (SELECT book_id FROM ${table} WHERE book_id = '${book_id}')`;

          db.deleteData('bps_association', deleteConditionBPS, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to delete associations.' });

            if (pk_fk.length > 0) {
              pk_fk.forEach(pk_id => {
                const associationFields = 'book_association_fk, pk_association_fk';
                const associationData = [book_id, pk_id];
            
                  db.insertData('bps_association', associationFields, associationData, (err, results) => {
                    if (err) {
                      console.error('Error inserting bps_association:', err);
                    }
                  });
              });
            }
          });
          db.deleteData('book_room_association', deleteConditionBR, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to delete associations.' });

            if (room_fk.length > 0) {
              room_fk.forEach(room_id => {
                const associationFields = 'book_association_id, room_association_id';
                const associationData = [book_id, room_id];
            
                  db.insertData('book_room_association', associationFields, associationData, (err, results) => {
                    if (err) {
                      console.error('Error inserting book_room_association:', err);
                    }
                    updateRoomStatus(room_id, 1, (err) => {
                      if (err) {
                        console.error('Error updating room status:', err);
                      }
                    });
                  });
              });
            }
          });
          updateCustomerStatus(cust_id_fk, 1, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update new customer status.' });
            res.status(200).json({ message: 'Booking updated successfully' });
          });
        });
      });
    });
  }
});

// Deactivate booking (soft delete)
router.patch('/:book_id', function (req, res) {
  const book_id = req.params.book_id;
  
  const fields = 'state';
  const newData = [0, book_id];
  const condition = 'book_id=?';

  db.updateData('booking', fields, newData, condition, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to deactivate booking' });
    }

    updateCustomerStatus(req.body.cust_id_fk, 0, (err) => {
      if (err) {
        console.error('Error updating customer status:', err);
        return res.status(500).json({ error: 'Failed to update customer status.' });
      }
      if (req.body.room_fk && req.body.room_fk.length > 0) {
        req.body.room_fk.forEach(room_id => {
          updateRoomStatus(room_id, 0, (err) => {
            if (err) {
              console.error('Error updating room status:', err);
            }
          });
        });
      }
      res.status(200).json({ message: 'Booking deactivated successfully', data: results });
    });
  });
});

// Delete booking
router.delete('/:book_id', function (req, res) {
  const book_id = req.params.book_id;
  const where = `book_id='${book_id}'`;

  db.deleteData('booking', where, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete booking.' });
    }

    updateCustomerStatus(req.body.cust_id_fk, 0, (err) => {
      if (err) {
        console.error('Error updating customer status:', err);
        return res.status(500).json({ error: 'Failed to update customer status.' });
      }

      res.status(200).json({ message: 'Booking deleted successfully', data: results });
    });
  });
});

// Get single booking by book_id
router.get('/single/:book_id', function (req, res) {
  const book_id = req.params.book_id;
  const where = `book_id='${book_id}'`;
  const tables = 'booking';
  db.singleAll(tables, where, (err, results) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(200).json(results);
  });
});
// Get all active bookings
router.get('/', function (req, res) {
  const tables = `booking
       LEFT JOIN customer ON booking.cust_id_fk = customer.cust_id 
       LEFT JOIN payment ON booking.pay_fk = payment.pay_id 
       LEFT JOIN bps_association ON booking.book_id = bps_association.book_association_fk 
       LEFT JOIN book_room_association ON booking.book_id = book_room_association.book_association_id
       LEFT JOIN room ON room.room_id = book_room_association.room_association_id
       LEFT JOIN package ON package.pk_id = bps_association.pk_association_fk
       `;

       const fields = `
       booking.book_id,
       booking.cust_id_fk,
       booking.pay_fk,
       booking.book_code, 
       booking.group_type, 
       booking.date, 
       booking.email,
       booking.tell, 
       booking.group_size,  
       CASE WHEN booking.note = '' THEN 'ບໍ່ລະບຸ' ELSE booking.note END AS note,
       customer.cust_code,
       customer.cust_name, 
       customer.cust_surname,
       payment.pay_id,
       payment.calculation,
       payment.get_money,
       payment.pay_date,
       payment.pay_status,
       GROUP_CONCAT(DISTINCT bps_association.pk_association_fk) AS pk_fk,
       GROUP_CONCAT(DISTINCT package.pk_name) AS pk_names,
       GROUP_CONCAT(DISTINCT package.pk_duration) AS pk_durations,
       GROUP_CONCAT(DISTINCT book_room_association.room_association_id) AS room_fk,
       GROUP_CONCAT(DISTINCT room.room_number) AS room_numbers
   `;
   
   const where = `booking.state = 1 GROUP BY booking.book_id`;
   
   db.selectWhere(tables, fields, where, (err, results) => {
     if (err) {
       return res.status(400).send();
     }
     results.forEach(row => {
       row.pk_fk = row.pk_fk ? row.pk_fk.split(',') : [];
       row.room_fk = row.room_fk ? row.room_fk.split(',') : [];
     });
     res.status(200).json(results);
   });   
});

module.exports = router;