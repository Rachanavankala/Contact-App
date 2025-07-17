// backend/routes/contacts.js  -- CORRECTED VERSION

const router = require('express').Router();
let Contact = require('../models/contact.model');

// READ all contacts
router.route('/').get((req, res) => {
  Contact.find()
    .then(contacts => res.json(contacts))
    .catch(err => res.status(400).json({ error: 'Error fetching contacts: ' + err }));
});

// CREATE a new contact
router.route('/add').post((req, res) => {
  const newContact = new Contact(req.body);

  newContact.save()
    .then(() => res.json({ message: 'Contact added!' }))
    .catch(err => {
      // ++ THIS BLOCK IS NOW CORRECTED ++
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; // Gets the name of the duplicate field (email or phoneNumber)
        const message = `This ${field} is already in use. Please use a different one.`;
        return res.status(400).json({ error: message });
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ error: messages.join(' ') });
      }
      return res.status(500).json({ error: 'An unexpected server error occurred.' });
    });
});

// UPDATE a contact by ID
router.route('/update/:id').post((req, res) => {
  Contact.findById(req.params.id)
    .then(contact => {
      contact.firstName = req.body.firstName;
      contact.lastName = req.body.lastName;
      contact.address = req.body.address;
      contact.email = req.body.email;
      contact.phoneNumber = req.body.phoneNumber;

      contact.save()
        .then(() => res.json({ message: 'Contact updated!' }))
        .catch(err => {
            // This block is already correct
            if (err.code === 11000) {
              const field = Object.keys(err.keyValue)[0];
              const message = `This ${field} is already in use. Please use a different one.`;
              return res.status(400).json({ error: message });
            }
            if (err.name === 'ValidationError') {
              const messages = Object.values(err.errors).map(val => val.message);
              return res.status(400).json({ error: messages.join(' ') });
            }
            return res.status(500).json({ error: 'An unexpected server error occurred.' });
        });
    })
    .catch(err => res.status(400).json({ error: 'Contact not found.' }));
});

// DELETE a contact by ID
router.route('/:id').delete((req, res) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: 'Contact deleted.' }))
    .catch(err => res.status(400).json({ error: 'Error deleting contact.' }));
});

module.exports = router;