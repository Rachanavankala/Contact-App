// backend/models/contact.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is a required field.'], 
    trim: true 
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is a required field.'], 
    trim: true 
  },
  address: { 
    type: String, 
    required: [true, 'Address is a required field.'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is a required field.'], 
    unique: true, 
    trim: true, 
    match: [/.+\@.+\..+/, 'Please use a valid email address.'] 
  },
  phoneNumber: { 
    type: String, 
    required: [true, 'Phone number is a required field.'],
    unique: true, 
    trim: true 
  },
}, {
  timestamps: true,
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;