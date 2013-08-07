
/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	livereload = require('express-livereload'),
	cors = require('cors'),
	path = require('path');

var app = express();

livereload(app, {
	watchDir: __dirname + '/public'
});

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


