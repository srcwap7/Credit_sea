const mongoose = require('mongoose');
const User = require('./schema/user-model');

let isConnected = false;

mongoose.connect("mongodb://localhost:27017/alumnet_central", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  isConnected = true;
  console.log("Connected to the database");
}).on('error', (error) => {
  console.log("Connection not established:", error);
});

module.exports = isConnected;
