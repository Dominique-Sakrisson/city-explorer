const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const request = require('superagent');
const geoData = require('./geojson.js');
const weatherData = require('./weather.js');
const { formatLocationResponse, mungeWeatherResponse } = require('./munger-functions.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

app.get('/location', async(req, res) => {
  try {
    const formattedResponse = formatLocationResponse(geoData);
    res.json(formattedResponse);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/weather', async(req, res) => {
  try{
    const finalResponse = mungeWeatherResponse(weatherData);
    res.json(finalResponse);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});
app.use(require('./middleware/error'));

module.exports = app;
