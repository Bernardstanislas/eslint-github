var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 8080));

app.get('/ping', function (req, res) {
    res.send('pong');
});

var server = app.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Eslint-github listening at http://%s:%s', host, port);
});
