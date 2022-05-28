//
// Freeddev Server
// Copyright (c) 2022 FreedTapstry21
//

// Basic variables and functions

var express = require('express');
var api = express();
var http = require('http');
var fs = require('fs');

var http_port = 80;
var webdir = 'web';
var logging = true;

var url;
var msg;
var tmp;

var date_ob;
var hours;
var minutes;
var seconds;
var day;
var month;
var year;

function time() {
	date_ob = new Date();
	hours = date_ob.getHours();
	minutes = date_ob.getMinutes();
	seconds = date_ob.getSeconds();
	msg = hours + ":" + minutes + ":" + seconds;
	return msg;
}

function date() {
	date_ob = new Date();
	day = ("0" + date_ob.getDate()).slice(-2);
	month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	year = date_ob.getFullYear();
	msg = day + "-" + month + "-" + year;
	return msg;
}

function logToFile(msg) {
	if (logging == true) {
		fs.writeFile('./journal.log', msg + '\n', { flag: 'a' }, function(err) {if (err) {warning("Couldn't write to the log journal!")}});
	}
}

function log(msg) {
	msg = time() + ' - [LOG] ' + msg;
	console.log(msg);
	logToFile(msg);
}

function error(msg) {
	msg = time() + ' - [ERROR] ' + msg;
	console.log(msg ); 
	logToFile(msg);
}

function warning(msg) {
	console.log(time() + ' - [WARNING] ' + msg);
}

// Welcome message

console.log('Welcome to the Freeddev server!');
log('Session started on ' + date())

log('Starting the web server...')

// Initializes the HTTP server

var server = http.createServer(function(req, res) {
	if (req.url == '/') {url = '/index';} else {url = req.url;}

	fs.readFile('./' + webdir + url, function(err, data) {
		if (err) {
			fs.readFile('./' + webdir + url + '.html', function(err, data) {
				if (err) {
					log('(' + req.socket.remoteAddress + '): Requested "' + url + '" but the file was not found!');
					fs.readFile('./404.html', function(err, data) {
						if (err) {res.writeHead(200, {'content-type': 'text/html'}); res.write('404: File not found!'); res.end();}
						else {res.writeHead(200, {'content-type': 'text/html'}); res.write(data); res.end();}
					});}
				else {res.writeHead(200, {'content-type': 'text/html'}); res.write(data); res.end(); log('(' + req.socket.remoteAddress + '): Requested "' + url + '"');}
			});}
		else {res.writeHead(200); res.write(data); res.end(); log('(' + req.socket.remoteAddress + '): Requested "' + url + '"');}
	});
});

// Starts the HTTP server

server.listen(http_port);
log('The web server has started on port ' + http_port + '!');

// 
// EOF (End of File)
//
