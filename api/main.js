const express = require('express');
const bodyParser = require('body-parser');

const server = express();
const hostname = '0.0.0.0';
const port = 8000;

// Use middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended : true, useNewUrlParser: true }));

// Add router
server.use('/api', require('./router'));

// Start server
server.listen(port, hostname, () => {
    console.log(`express server is running on port: ${port}`);
});