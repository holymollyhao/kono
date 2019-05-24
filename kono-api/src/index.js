const express = require('express');
const app = express();
//const path = require(path);

//const api = require('./api');
//const db = require('/db')

//db.connect();

app.get('/', (req, res) => {
  res.send('Hello world!');
})

app.listen(80, (req, res) => {
  console.log("Server is running on port 80!")
});
