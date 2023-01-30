const express = require('express')
const cors = require('cors');
const morgan = require('morgan');
var Hjson = require('hjson');
require('dotenv').config();
const fs = require('fs/promises');

// Create Express Instance
const app = express();
const port = process.env.PORT || 1337;

// Middleware
app.use(cors());
app.use(morgan('tiny'));

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse various different custom JSON types as JSON
app.use(express.json());

//functions
async function example(filename, content) {
    try {
      await fs.writeFile(`data/${filename}.json`, content);
    } catch (err) {
      console.log(err);
      await fs.writeFile(`err/${filename}.json`, err);
    }
  }

// Endpoint definition
app.post('/', (req, res) => {
    // assign apiKey to the header value x-api-key
    let apiKey = req.header('x-api-key')

    // Check if apiKey is filled, else set value to unix timestamp of the current time
    apiKey ? apiKey : apiKey = Date.now().toString()

    // call file creation function
    example(apiKey, JSON.stringify(req.body))

    // Send response
    //res.json(JSON.stringify(req.body))
  res.json(req.body)
})

app.get('/', (req, res) => {
    // assign apiKey to the header value x-api-key
    let apiKey = req.header('x-api-key')

    // Check if apiKey is filled, else set value to unix timestamp of the current time
    apiKey ? apiKey : apiKey = Date.now().toString()
    
    // call file creation function
    example(apiKey, "GET-Request No Body")
    
    // Send response
    res.send("Successful "+ apiKey)
})

// start server
app.listen(port, () => {
    console.log(`Server listening on Port: ${port}`);
  });