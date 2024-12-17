require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { createWriteStream } = require("fs");

const subject = "Hello from Voxover AI";
const to = `${process.env.RECIEVER_EMAIL}`;

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.RECIEVER_EMAIL,
    pass: process.env.PASSWORD, // Ensure you secure your credentials
  },
});

// Send the email
function sendMail(to, sub, msg) {
  transporter.sendMail({
    to: to,
    subject: sub,
    html: msg,
  });
}

// Initialize express app
const app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", "views");

const accessLogStream = createWriteStream(path.join(__dirname, 'access.log'), 
{flags: 'a'});
// Middleware for parsing JSON and URL-encoded data
app.use(express.json()); // Added to handle JSON payloads
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

// Define a route to handle the POST request
app.post("/contact-us", (req, res) => {
  const { firstName, lastName, email, useCase, calls, findUs } = req.body;

  // Validate names
  const nameRegex = /^[a-zA-Z]{2,}$/; // Only letters, minimum length 2
  if (
    !nameRegex.test(firstName) || // First name invalid
    !nameRegex.test(lastName) || // Last name invalid
    !email || !/^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) || // Email invalid
    !useCase || useCase.length <= 10 || // Use case too short
    calls === "select" || // Calls not selected
    findUs === "Select" // FindUs not selected
  ) {
    return res.status(400).json({ error: "Invalid form data. Please fill out all fields correctly." });
  }

  // Prepare the message for the email
  const msg = `
    <h1>New Contact Form Submission</h1>
    <p><strong>First Name:</strong> ${firstName}</p>
    <p><strong>Last Name:</strong> ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Use Case:</strong> ${useCase}</p>
    <p><strong>Expected Calls:</strong> ${calls}</p>
    <p><strong>Found Us Via:</strong> ${findUs}</p>
  `;

  // Send the email
  sendMail(to, subject, msg);

  // Respond with success
  res.status(200).json({ message: "Form submitted successfully." });
});


// Route to render the home page
app.get("/", (req, res) => {
  res.render("home");
});

// 404 Error

app.use((req, res, next)=>{
  res.render("404");
})

const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
