const express = require('express');
const https = require('https');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
  }));

app.get('/users', (req, res) => {
    const url = 'https://jsonplaceholder.typicode.com/users';

    https.get(url, (response) => {
        let data = '';

        // A chunk of data has been received.
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        response.on('end', () => {
            res.send(JSON.parse(data));
        });

    }).on("error", (error) => {
        console.log("Error: ", error);
        res.send({ error: 'Failed to fetch data from API' });
    });
});


app.get('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`, { httpsAgent: agent });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));