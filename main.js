const express = require('express')
const cors = require('cors');
const morgan = require('morgan');
require("dotenv").config()
const { Pool, Client } = require('pg')

require('dotenv').config();

// Create Express Instance
const app = express();
const port = process.env.PORT || 1337;

// Database connection
const pool = new Pool();

// Middleware
app.use(cors())
app.use(morgan('tiny'));

// parse various different custom JSON types as JSON
app.use(express.json());

// Endpoint definition
app.post('/data/beerpi/sensors', (req, res) => {
    // assign apiKey to the header value x-api-key
    let apiKey = req.header('x-api-key')
    if(apiKey === process.env.APIKEY) {
      
      const body = req.body
      const timesStamp = new Date().toISOString()

      let sensorId = body.sensorId
      let sensorName = body.sensorName
      let sensorValue = body.sensorValue

      console.log(body)
    
      // Check if values are filled, if not, add default
      sensorId ? sensorId : sensorId = 'na' 
      sensorName ? sensorName : sensorName = 'na'
      sensorValue ? sensorValue : sensorValue = '999'

      // Insert value in Database
      try {
        pool.query(`INSERT INTO "monitoring_data"("sensor_id", "sensor_name", "sensor_value", "timestamp") VALUES($1, $2, $3, $4)`, 
          [sensorId, sensorName, sensorValue, timesStamp])
      } catch (e) {
        throw e
      } finally {
        pool.end
      }

      // get last entry - TEST ONLY
      pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT * FROM "monitoring_data" order by id desc', (err, res) => {
          done()
          if (err) {
            console.log(err.stack)
          } else {
            console.log("Entry:" + res.rows[0].sensor_id + " : " + res.rows[0].sensor_value)
          }
        })
      })

      res.json(req.body)

  }else{
    res.json({"message": "wrong API key"})
  }
})

// start server
app.listen(port, () => {
    console.log(`Server listening on Port: ${port}`);
  });