const mongoose = require('mongoose');

// MongoDB schema
const dataSchema = new mongoose.Schema({
  temperature: Number,
  batteryLevel: Number,
  timeStamp: String,
});

const Data = mongoose.model('Data', dataSchema);

// Part 1: Save data to the database
async function saveData(data) {
  const newData = new Data(data);
  await newData.save();
}

// Part 2: Get latest data from the database
async function getLatestData(limit) {
  return Data.find().sort({ _id: -1 }).limit(limit);
}

// Part 2: Get historical data based on start and end date
async function getHistoricalData(startDate, endDate) {
  return Data.find({
    timeStamp: { $gte: startDate, $lte: endDate },
  });
}

module.exports = { saveData, getLatestData, getHistoricalData };