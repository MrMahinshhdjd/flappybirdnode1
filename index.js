const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies
app.use(express.static('public'));
app.use(bodyParser.json());

// Directory to store save files
const saveDirectory = path.join(__dirname, 'saves');

// Ensure the save directory exists
if (!fs.existsSync(saveDirectory)) {
  fs.mkdirSync(saveDirectory, { recursive: true });
}

/**
 * Endpoint to save game data.
 * Expects a JSON payload with at least a "username" property.
 */
app.post('/save', (req, res) => {
  const gameData = req.body;
  if (!gameData.username) {
    return res.status(400).json({ message: 'Username is required to save game data.' });
  }

  const filePath = path.join(saveDirectory, `${gameData.username}.json`);

  fs.writeFile(filePath, JSON.stringify(gameData, null, 2), err => {
    if (err) {
      console.error('Error saving game data:', err);
      return res.status(500).json({ message: 'Error saving game data.' });
    }
    res.json({ message: 'Game saved successfully!' });
  });
});

/**
 * Endpoint to load game data for a given username.
 */
app.get('/load/:username', (req, res) => {
  const username = req.params.username;
  const filePath = path.join(saveDirectory, `${username}.json`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error loading game data:', err);
      return res.status(500).json({ message: 'Error loading game data.' });
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
