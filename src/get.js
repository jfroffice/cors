var fs = require('fs');
var path = require('path');
var smartcrop = require('smartcrop-sharp');
var sharp = require('sharp');
var TMP = '.tmp';

exports.init = function(app) {
    function getFilename(params) {
        return path.resolve(__dirname, './upload/' + params.id + '/' + params.module + '/' + params.filename);
    }

    function render(res, filename) {
	   fs.createReadStream(filename)
	    .on('error', function(err){
    		if (err.code === 'ENOENT'){
    		    res.writeHead(404, { 'Content-type': 'text/plain' });
    		    res.end('404 Not Found\n');
    		} else {
    		    res.writeHead(500, { 'Content-type': 'text/plain' });
    		    res.end(err + '\n');
    		}
	    })
	    .on('open', function(){
    		res.writeHead(200, {
    		    'Pragma': 'public',
    		    'Cache-Control': 'public, max-age=864000000',
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
                var width = +resizeParams.width;
                var height = +(resizeParams.height || resizeParams.width);
                smartcrop.crop(resizeParams.srcPath, {width: width, height: height}).then(function(result) {
                  var crop = result.topCrop;
                  console.log(crop);
                  sharp(resizeParams.srcPath)
                    .extract({width: crop.width, height: crop.height, left: crop.x, top: crop.y})
                    .resize(width, height)
                    .toFile(resizeParams.dstPath, function(err) {
                        if (err) {
                            res.writeHead(500, { 'Content-type': 'text/plain' });
                            res.end(err + '\n');
                        }

                        render(res, resizeParams.dstPath);
                    });
                });
            }
        });
    }

    function resizeRenderWidth(res, srcPath, width) {
        resizeRender(res, {
            srcPath: srcPath,
            dstPath: srcPath + '.' + width + TMP,
            width: width, // + '\>',
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


