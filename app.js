/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	livereload = require('express-livereload'),
	cors = require('cors'),
	config = require('./config'),
	upload = require('./service/upload'),
	path = require('path'),
	app = express();

livereload(app, {
	watchDir: __dirname + '/public'
});

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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});