
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

const autoId = (table, fields, callback) => {
    const maxId = new Date().getFullYear() + '001';
    connection.query(`SELECT MAX(${fields}) + 1 AS maxid FROM ${table}`, (err, results, fields) => {
        if (err) {
            console.error('Error selecting data:', err);
            return callback(err, null);
        }
        let generatedId = maxId; 
        if (results.length > 0 && results[0].maxid !== null) {
            generatedId = results[0].maxid.toString();
        }
        callback(null, generatedId);
    });
};
const maxCode = (table, fields, callback) => {
    connection.query(`SELECT MAX(${fields}) AS maxid FROM ${table}`, (err, results, fields) => {
        if (err) {
            console.error('Error selecting data:', err);
            return callback(err, null);
        }
        let codeId = '0001'; 
        if (results.length > 0 && results[0].maxid !== null) {
            // codeId = results[0].maxid.toString();
            codeId = (parseInt(results[0].maxid) + 1).toString().padStart(4, '0');
        }
        callback(null, codeId);
    });
};

const insertData = (table, fields, data, callback) => {
    const placeholders = new Array(data.length).fill('?').join(', ');
    const query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;
    connection.query(query, data, (err, results, fields) => {
        if (err) {
            console.error('Error inserting data:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

const updateData = (table, field, data, condition, callback) => {
    // const placeholders = new Array(data.length).fill('?').join(', ');
    const setFields = field.split(',').map(field => `${field} = ?`).join(', ');
    const query = `UPDATE ${table} SET ${setFields} WHERE ${condition}`;
    connection.query(query, data, (err, results) => {
        if (err) {
            console.error('Error updating data:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};


const updateField = (table, setFields, condition, callback) => {
    const query = `UPDATE ${table} SET ${setFields} WHERE ${condition}`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error updating data:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

const deleteData = (table, where, callback) => {
    const query=`DELETE FROM ${table} WHERE ${where}`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error delete data:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

const selectAll = (table, callback) => {
    connection.query(`SELECT * FROM ${table}`, (err, results, fields) => {
        if (err) {
            console.error('Error selecting data:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

const selectData = (table, fields, callback) => {
    const query=`SELECT ${fields} FROM ${table}`;
    connection.query(query, (err, results, fields) => {
        if (err) {
            console.error('Error selecting data:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

const selectWhere = (table, fields, where,  callback) => {
    const query=`SELECT ${fields} FROM ${table} WHERE ${where}`;
    connection.query(query, (err, results, fields) => {
        if (err) {
            console.error('Error selecting data:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

const queryData = (table, fields, where, values, callback) => {
    const query = `SELECT ${fields} FROM ${table} WHERE ${where}`;
    connection.query(query, values, (err, results, fields) => {
        if (err) {
            console.error('Error selecting data:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

const singleAll = (table, where,  callback) => {
    const query=`SELECT * FROM ${table} WHERE ${where}`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error selecting data:', err);
            return callback(err, null);
        }
        callback(null, results[0]);
    });
};

const fetchSingle = (table, fields, where,  callback) => {
    const query = `SELECT ${fields} FROM ${table} WHERE ${where} LIMIT 1`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error selecting data:', err);
            return callback(err, null);
        }
        callback(null, results[0]);
    });
};
//-----------------
const countData = (table, fields,where, callback) => {
    connection.query(`SELECT COUNT(${fields}) qtydata FROM ${table} WHERE ${where}`, (err, results) => {
        if (err) {
            console.error('Error selecting data:', err);
            return callback(err, null);
        }
        callback(null, results.qtydata);
    });
};


module.exports = {
    autoId,
    maxCode,
    insertData,
    updateData,
    deleteData,
    selectAll,
    queryData,
    selectData,
    selectWhere,
    singleAll,
    fetchSingle,
    countData,
    updateField
};
