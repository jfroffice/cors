var fs = require('fs'),
	path = require('path');

exports.init = function(app) {

	app.get('/:id/:module/:filename', function(req, res) {

        var tmp = '../upload/' + req.params.id + '/' + req.params.module + '/' + req.params.filename,
			filename = path.resolve(__dirname, tmp);

		fs.createReadStream(filename)
			.on('error', function(err){
				if (err.code === 'ENOENT'){
					res.writeHead(404, {
						'Content-type': 'text/plain'
					});
					res.end('404 Not Found\n');
				} else {
					res.writeHead(500, {
						'Content-type': 'text/plain'
					});
					res.end(err + '\n');
				}
			})
			.on('open', function(){
				res.writeHead(200, {
					'Pragma': 'public',
					'Cache-Control': 'private, max-age=10',
					'Content-type': ''
				});
			})
			.pipe(res);
    });
};