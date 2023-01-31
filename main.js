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

// Constants & Variables
let errorCounter = 0

// Telegram Alarm
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM;
const bot = new TelegramBot(token, {polling: true});
    
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
      const unix_timestamp = new Date()

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
        pool.query(`INSERT INTO "monitoring_data"("sensor_id", "sensor_name", "sensor_value", "timestamp", "unix_timestamp") VALUES($1, $2, $3, $4, $5)`, 
          [sensorId, sensorName, sensorValue, timesStamp, unix_timestamp])
      } catch (e) {
        throw e
      } finally {
        pool.end
      }

      res.json(req.body)

  }else{
    res.json({"message": "wrong API key"})
  }
})

// get last entry - TEST ONLY
const checkData = () => {
pool.connect((err, client, done) => {
  if (err) throw err
  client.query('SELECT * FROM "monitoring_data" order by id desc', (err, res) => {
    done()
    if (err) {
      console.log(err.stack)
    } else {

      var currentDateObj = new Date();
      var numberOfMlSeconds = currentDateObj.getTime();
      var addMlSeconds = 60 * 1000; // one minute

      // Get Date from Database and convert tu Unix Timestamp (milliconds since Epoche)
      const lastDateTimeDatabase = Date.parse(res.rows[0].unix_timestamp)

      var checkDate = lastDateTimeDatabase + addMlSeconds;
      if(checkDate < numberOfMlSeconds) {
        
        // check errorCounter to prevent multiple messages
        if(errorCounter === 3){
          console.log("ErrorCounter" + errorCounter + "! Fox Beer is offline! message sent!")
          bot.sendMessage(921253119, "Fox-Beer nicht erreichbar! Letzter Kontakt: " + res.rows[0].unix_timestamp)

          // increase errorCOunter
          errorCounter = errorCounter + 1
        }
        else {
          // increase Errorcounter by one + show message in console
          errorCounter = errorCounter + 1
          console.log("Errorcounter: " + errorCounter + " Fox Beer is still offline. No Message sent!")
        }
      }
      else if (errorCounter > 0 ){
        console.log("Fox-Beer is back! message sent")
        
        // Send Telegram message that beerPi is back online
        bot.sendMessage(921253119, "Fox-Beer ist zurück!")

        // Reset Error Counter
        errorCounter = 0

      }else(
        console.log("All ok. Fox-Beer is online! No message sent!") 
      )
    }
  })
})
}

// Calls CheckData all 10 Seconds
setInterval(checkData, 10000)

// start server
app.listen(port, () => {
    console.log(`Server listening on Port: ${port}`);
  });