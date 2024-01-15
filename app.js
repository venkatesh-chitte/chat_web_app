const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const { saveData, getLatestData, getHistoricalData } = require('./models.js');
const { configureSocket } = require('./socket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Part 1: Save random data to the database
app.post('/api/saveData', async (req, res) => {
  try {
    const data = req.body;
    await saveData(data);
    io.emit('newData', data); // Send new data to all connected clients
    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Part 2: Get latest 20 records
app.get('/api/latestData', async (req, res) => {
  try {
    const latestData = await getLatestData(20);
    res.status(200).json(latestData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Part 2: Get historical data based on start and end date
app.get('/api/historicalData', async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const historicalData = await getHistoricalData(startDate, endDate);
    res.status(200).json(historicalData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  app.get('/historicalData', (req, res) => {
    res.sendFile(__dirname + '/historicalData.html');
  });
  
  // Part 2: Configure WebSocket for real-time updates
  configureSocket(io);
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });