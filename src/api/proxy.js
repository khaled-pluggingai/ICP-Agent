const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001; // Updated to port 3001 for our proxy server

// Middleware
app.use(bodyParser.json());

// Updated Proxy endpoint to match frontend usage
app.post('/api/send-to-clay', async (req, res) => {
  const { webhookUrl, data } = req.body;

  if (!webhookUrl || !data) {
    return res.status(400).json({ error: 'webhookUrl and data are required' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const responseData = await response.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in proxy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});