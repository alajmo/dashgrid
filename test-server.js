var express = require('express');
express().use('/', express.static(__dirname + '/specs/'))
    .listen(5000, () => {console.log(`Listening http://localhost:5000`);});
