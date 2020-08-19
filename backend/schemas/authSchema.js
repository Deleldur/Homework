const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  userPassword: String,
  userEmail: String,
  creationDate: { type: Date, default: Date.now }
});

const Login = mongoose.model('users', userSchema);
module.exports = Login;
