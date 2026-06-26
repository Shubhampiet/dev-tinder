const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  firstName: {type:String, required:true}, 
  lastName: {type:String, required:true},
  email: { type: String, required: true, unique: true, validate: { validator: validator.isEmail, message: 'Invalid email address' } },
  password: { type: String, required: true, minlength: 6 },
},

{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
