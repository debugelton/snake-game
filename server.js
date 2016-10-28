'use strict';
const fs      = require('fs'); 
const express = require('express');
const app     = express();

app.use('/js', express.static('js'));

app.get('/', function (req, res) {
    fs.readFile('index.html', function (err, buf) {
        if (err) return done(err);
        res.setHeader('Content-Type', 'text/html');
        res.end(buf);
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});