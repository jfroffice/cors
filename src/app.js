/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	cors = require('cors'),
	config = require('./config'),
	upload = require('./service/upload'),
	get = require('./service/get'),
	path = require('path'),
	app = express();

// all environments
app.set('port', process.env.PORT || config.port);
app.use(express.logger('dev'));
app.use(express.bodyParser({
    uploadDir: __dirname + '/upload'
}));
app.use(express.methodOverride());
app.use(cors({
	origin: config.cors.origin
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

upload.init(app);
get.init(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
