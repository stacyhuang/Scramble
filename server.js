var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Parse application/json
app.use(bodyParser.json());

// Serve static asset
app.use(express.static(__dirname + '/client'));

app.listen(process.env.PORT || 8000);