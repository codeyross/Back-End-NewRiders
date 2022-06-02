const mongoose = require("mongoose");
require('dotenv').config()
const mongoURI =  process.env.DEV_DB_URL;

mongoose
  .connect(mongoURI)
  .then((instance) =>
    console.log(`Connected to db: ${instance.connections[0].name}`)
  )
  .catch((error) => console.log("Connection failed!", error));

module.exports = mongoose;