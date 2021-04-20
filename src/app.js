/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	config = require('./config'),
	upload = require('./service/upload'),
 	get = require('./service/get'),
	methodOverride = require('method-override'),
	morgan = require('morgan'),
	LOGGER = 'development' === env ? 'tiny' : 'short',
	app = express(),
	env = app.get('env'),
	logger = require('./logger').get();

var errorhandler = require('errorhandler');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
app.set('port', process.env.PORT || config.port);
if (process.env.NODE_ENV !== 'development') {
	app.use(morgan(LOGGER, { stream: logger.stream }));
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride());
app.use(serveStatic('public'));

if ('development' == app.get('env')) {
	app.use(errorhandler());
}

upload.init(app);
get.init(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
