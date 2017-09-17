const express = require('express');
const bodyParser = require('body-parser');

const recastBot = require('./bot');
const config = require('./config');

const onNewMessage = require('./message');

const app = express();
const port = config.PORT || 5000;
app.set('port', port);
app.use(bodyParser.json());

app.post('/', function(req, res) {
  recastBot.connect.handleMessage(req, res, onNewMessage);
});

app.listen(port, function() {
  console.log(`App is listening on port ${port}`);
});
