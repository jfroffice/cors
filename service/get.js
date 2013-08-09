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

	function resizeRender(res, resizeParams) {
    	fs.exists(resizeParams.dstPath, function(exists) {
            if (exists) {
            	render(res, resizeParams.dstPath);
            } else {
                im.resize(resizeParams, function(err) {
                    if (err) {
                        res.writeHead(500, {
							'Content-type': 'text/plain'
						});
						res.end(err + '\n');
                    } else {
                    	render(res, resizeParams.dstPath);
                    }
                });
            }
        });
    }

	app.get('/:id/:module/:filename', function(req, res) {
		render(res, getFilename(req.params));
    });

    app.get('/:id/:module/:filename/:width', function(req, res) {

        var srcPath = getFilename(req.params),
			width = req.params.width;

		resizeRender(res, {
            srcPath: srcPath,
            dstPath: srcPath + '.' + width + TMP,
            width: width + '\>',
            progressive: true,
            sharpening: 0,
            filter: false,
        });
    });

    app.get('/:id/:module/:filename/:width/:height', function(req, res) {

        var srcPath = getFilename(req.params),
			width = req.params.width,
			height = req.params.height;

        resizeRender(res, {
            srcPath: srcPath,
            dstPath: srcPath + '.' + width + 'x' + height + TMP,
            width: width,
            height: height,
            progressive: true,
            sharpening: 0,
            filter: false,
        });
    });
};