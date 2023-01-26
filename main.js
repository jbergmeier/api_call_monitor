const express = require('express')
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Create Express Instance
const app = express();
const port = process.env.PORT || 1337;

// Middleware
app.use(cors());
app.use(morgan('tiny'));

// Endpoint definition
app.post('/', (req, res) => {
    console.log("Hello")
    res.json({'message': 'hello, it is working'})
})

app.get('/', (req, res) => {
    console.log("Hello")
    res.json({'message': 'hello, it is working'})
})

// start server
app.listen(port, () => {
    console.log(`Server listening on Port: ${port}`);
  });