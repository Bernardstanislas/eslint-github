var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var linter = require('./linter.js');

// Be able to parse POST requests

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

// Get the port from heroku

app.set('port', (process.env.PORT || 8080));

// Respond to a ping

app.get('/ping', function (req, res) {
    res.send('pong');
});

// Respond to Github webhook

app.post('/', function(req, res) {
    linter.onPush(req.body);
    var fs = require('fs');
    fs.writeFile("./test.json", JSON.stringify(req.body), function() {});
    res.end('ok');
});

// Start server

var server = app.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Eslint-github listening at http://%s:%s', host, port);
});
