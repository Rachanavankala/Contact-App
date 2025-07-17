// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
mongoose.set('strictQuery', true);
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = "mongodb+srv://contact-app-user:rachana777@cluster0.xy9hx8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully.");
});

// API Routes
const contactsRouter = require('./routes/contacts');
app.use('/contacts', contactsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});