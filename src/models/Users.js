const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usersSchema = new Schema(
  {
    user: String,
    password: String,
    name: String,
    email: String,
    plan_details: String,
  },
  { collection: 'users' }
);
const User = mongoose.model('users', usersSchema);
module.exports = User;
