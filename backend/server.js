// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
mongoose.set('strictQuery', true); // Suppresses the Mongoose 7 deprecation warning

// This line is crucial for deployment. It tells the server to use
// the port assigned by the hosting service (like Render) or default to 5000 for local development.
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enables Cross-Origin Resource Sharing so your frontend can talk to this backend
app.use(express.json()); // Allows the server to understand JSON data in request bodies

// --- Database Connection ---
// This line is also set up for deployment. It will look for the database URL in an
// environment variable called DATABASE_URL. If it's not found, it will fall back to
// your hardcoded Atlas string (make sure to replace it with your actual string).
const uri = process.env.DATABASE_URL || "mongodb+srv://contact-app-user:rachana777@cluster0.xy9hx8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully.");
});

// --- API Routes ---
// This line imports the logic for handling all the /contacts endpoints
const contactsRouter = require('./routes/contacts');
// This line tells the server that any URL starting with /contacts should use the contactsRouter
app.use('/contacts', contactsRouter);

// --- Start the Server ---
// This makes the server start listening for incoming requests on the specified port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});