var fs = require('fs'),
	path = require('path'),
	TMP = '.tmp',
	OK_TMP = '.ok' + TMP,
    im = require('imagemagick');

exports.init = function(app) {

    function getFilename(params) {
        return path.resolve(__dirname, '../upload/' + params.id + '/' + params.module + '/' + params.filename);
    }

    function getFilenameId(params) {
        return path.resolve(__dirname, '../upload/' + params.id);
    }

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
					'Cache-Control': 'private, max-age=2',
					'Content-type': ''
				});
			})
			.pipe(res);
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

    function resizeRenderWidth(res, srcPath, width) {
        resizeRender(res, {
            srcPath: srcPath,
            dstPath: srcPath + '.' + width + TMP,
            width: width + '\>',
            progressive: true,
            sharpening: 0,
            filter: false,
        });
    }

    function resizeRenderWidthHeight(res, srcPath, width, height) {


        resizeRender(res, {
            srcPath: srcPath,
            dstPath: srcPath + '.' + width + 'x' + height + TMP,
            width: width,
            height: height,
            progressive: true,
            sharpening: 0,
            filter: false,
        });
    }

    app.get('/get/:id', function(req, res) {
        render(res, getFilenameId(req.params));
    });

    app.get('/get/:id/:width', function(req, res) {
        resizeRenderWidth(res, getFilenameId(req.params), req.params.width);
    });

    app.get('/get/:id/:width/:height', function(req, res) {
        resizeRenderWidthHeight(res, getFilenameId(req.params), req.params.width, req.params.height);
    });

	app.get('/:id/:module/:filename', function(req, res) {
		render(res, getFilename(req.params));
    });

    app.get('/:id/:module/:filename/:width', function(req, res) {
        resizeRenderWidth(res, getFilename(req.params), req.params.width);
    });

    app.get('/:id/:module/:filename/:width/:height', function(req, res) {
        resizeRenderWidthHeight(res, getFilename(req.params), req.params.width, req.params.height);
    });
};