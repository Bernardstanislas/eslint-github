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
    if (req.body.res === 'refs/heads/changes') {
        console.log('Push event');
        linter.onPush(req.body);
    }
    res.end('ok');
});

// Start server

var server = app.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Eslint-github listening at http://%s:%s', host, port);
});
