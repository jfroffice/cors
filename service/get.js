var fs = require('fs'),
	path = require('path'),
	TMP = '.tmp',
	OK_TMP = '.ok' + TMP,
    im = require('imagemagick');

exports.init = function(app) {

	function render(res, filename) {
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
	}

	function getFilename(params) {
		return path.resolve(__dirname, '../upload/' + params.id + '/' + params.module + '/' + params.filename);
	}

	app.get('/:id/:module/:filename', function(req, res) {
		render(res, getFilename(req.params));
    });

    app.get('/:id/:module/:filename/:size', function(req, res) {

        var srcPath = getFilename(req.params),
			size = req.params.size,
			dstPath = srcPath + '.' + size + TMP;

		fs.exists(dstPath, function(exists) {
            if (exists) {
            	render(res, dstPath);
            } else {
            	console.log(srcPath);
            	console.log(dstPath);

                im.resize({
                    srcPath: srcPath,
                    dstPath: dstPath,
                    width:   size + '\>',
                    quality: 0.8,
                    strip: true,
                    sharpening: 0,
                    filter: false,
                }, function(err) {
                    if (err) {
                    	console.log(err);
                        res.writeHead(500, {
							'Content-type': 'text/plain'
						});
						res.end(err + '\n');
                    } else {
                    	render(res, dstPath);
                    }
                });
            }
        });
    });
};