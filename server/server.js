const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON bodie

const routes = [
  'service',
  'staff', 
  'province',
  'district',
  'customer',
  'imp',
  'product',
  'protype',
  'unit',
  'duration',
  'timeperday',
  'service',
  'service_type',
  'booking',
  'payment',
  'set_product'
];

routes.forEach(route => {
  app.use(`/${route}`, require(`./api/${route}`));
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Start server
const port = process.env.PORT || 5300;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});