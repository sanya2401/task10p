require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mailgun = require('mailgun-js');
const cors = require('cors');  // For enabling cross-origin requests

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For parsing JSON data

// Serve static files
app.use(express.static('public'));

// Mailgun setup
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Subscription route
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  const data = {
    from: 'welcome@devdeakin.com',
    to: email,
    subject: 'Welcome to DEV@Deakin!',
    text: 'Thank you for subscribing to DEV@Deakin!',
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }

    res.send('Email sent successfully!');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
