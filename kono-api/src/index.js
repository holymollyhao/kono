const express = require('express');
const app = express();
const api = require('./api');
app.use('/api', api);

app.listen(80, (req, res) => {
  console.log("Server is running on port 80!")
});
