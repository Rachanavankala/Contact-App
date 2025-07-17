// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // The new, high-quality stylesheet

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', address: '', email: '', phoneNumber: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/contacts';

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(API_URL);
      setContacts(response.data);
    } catch (err) {
      setError('Could not fetch contacts.');
    }
  };
  
  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!formData.firstName || !formData.email) {
      setError('First name and email are required fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await axios.post(`${API_URL}/update/${currentContactId}`, formData);
        setMessage('Contact updated successfully!');
      } else {
        response = await axios.post(`${API_URL}/add`, formData);
        setMessage('Contact added successfully!');
      }
      fetchContacts();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  const handleEdit = (contact) => {
    clearMessages();
    setIsEditing(true);
    setCurrentContactId(contact._id);
    setFormData(contact);
    document.getElementById('form-container').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    clearMessages();
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Contact deleted successfully.');
      fetchContacts();
    } catch (err) {
      setError('Could not delete contact.');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentContactId(null);
    setFormData({ firstName: '', lastName: '', address: '', email: '', phoneNumber: '' });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Contact Management</h1>
        <p>A simple and elegant way to manage your contacts.</p>
      </header>
      
      <main>
        <section id="form-container" className="card">
          <h2>{isEditing ? 'Edit Contact' : 'Add New Contact'}</h2>
          {message && <p className="message success">{message}</p>}
          {error && <p className="message error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name*" />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
            </div>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address*" />
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">{isEditing ? 'Update Contact' : 'Add Contact'}</button>
              {isEditing && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
            </div>
          </form>
        </section>

        <section className="list-container">
          <h2>Contact List</h2>
          <div className="contact-grid">
            {contacts.map(contact => (
              <article key={contact._id} className="contact-card">
                <div className="contact-info">
                  <h3>{contact.firstName} {contact.lastName}</h3>
                  <p className="contact-email">{contact.email}</p>
                  <p className="contact-phone">{contact.phoneNumber}</p>
                  <p className="contact-address">{contact.address}</p>
                </div>
                <div className="contact-actions">
                  <button onClick={() => handleEdit(contact)} className="btn-icon btn-edit">Edit</button>
                  <button onClick={() => handleDelete(contact._id)} className="btn-icon btn-delete">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;