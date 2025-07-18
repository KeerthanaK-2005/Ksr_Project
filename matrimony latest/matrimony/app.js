const express = require('express');
const dotenv = require('dotenv');
const db = require('./models/index.js');
const routes = require('./routes');
const path = require('path');
dotenv.config(); 
const app = express();

app.use(express.json());

app.use("/", routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

db.sequelize.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("DB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`);
});