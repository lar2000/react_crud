const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON bodie

const routes = [
  'staff', 
  'province',
  'district',
  'customer',
  'room',
  'roomtype',
  'imp',
  'product',
  'protype',
  'unit',
  'package',
  'service',
  'service_type',
  'booking',
  'checkin',
  'payment',
  'checklogin',
  'set_product'
];

routes.forEach(route => {
  app.use(`/${route}`, require(`./api/${route}`));
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Start server
const port = process.env.PORT || 5300;
app.listen(port, () => {
  console.log(`⚡Server is running on http://localhost:${port}`);
});