var express = require('express');
express().use('/', express.static(__dirname + '/demo'))
    .listen(3000, () => {console.log(`Listening http://localhost:3000`);});
