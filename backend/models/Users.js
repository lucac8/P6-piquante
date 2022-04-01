const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //Ajout du plugin uniqueValidator au schema qui renvoie une erreur de mongoose si pas unique 

module.exports = mongoose.model('User', userSchema);