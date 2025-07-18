require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require('./config/sequelize');
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

  // Middlewares
app.use(express.json());

const routes = require("./routes");

// Use routes
app.use("/", routes);
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    // Then sync after authentication is successful
    return sequelize.sync({ force: false });
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });