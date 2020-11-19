/* var http = require('http');
fs=require('fs');
path=require('path');
console.log('Server started');
http.createServer((req,res)=>{
    console.log(`Адрес: ${req.url}`);
    var fileTemperature=fs.readFileSync(path.join(__dirname,'temperature.json'));
    var filePrecipitation=fs.readFileSync(path.join(__dirname,'precipitation.json'));
    if (req.url.startsWith('/api/temperature')){
        res.statusCode=200;
        res.end(fileTemperature);
    }
    else if (req.url.startsWith('/api/precipitation')){
        res.statusCode=200;
        res.end(fileTemperature);
    }
    
// }).listen(3000);
}).listen(3000); */

// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const fs = require('fs');

// Get our API routes
// const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/', (req, res) => {
	res.send('<h2>Hello, Express!!</h2>');
});

app.get('/temperature', (req, res) => {
	// const filePath = req.url.substr(1);
	fs.readFile('temperature.json', function(error, data) {
		if (error) {
			res.statusCode = 404;
			res.end('Resourse not found!');
		} else {
			res.end(data);
		}
	});
});

app.get('/precipitation', (req, res) => {
	// const filePath = req.url.substr(1);
	fs.readFile('precipitation.json', function(error, data) {
		if (error) {
			res.statusCode = 404;
			res.end('Resourse not found!');
		} else {
			res.end(data);
		}
	});
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3300';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
