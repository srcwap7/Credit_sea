const mongoose = require('mongoose');
const User = require('./schema/user-model');

let isConnected = false;

mongoose.connect("mongodb+srv://arpangoswami462:arpangoswami462@cluster1.80v4a.mongodb.net/alumnet_central?retryWrites=true&w=majority&appName=Cluster1", {
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
