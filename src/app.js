/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	cors = require('cors'),
	config = require('./config'),
//	upload = require('./service/upload'),
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride());
app.use(cors({
	origin: config.cors.origin
}));
app.use(serveStatic('public'));

if ('development' == app.get('env')) {
	app.use(errorhandler());
}

// upload.init(app);
get.init(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
