var fs = require('fs'),
	path = require('path');

exports.init = function(app) {

	function isError(err, res) {
		if (err) {
			res.send(500);
			return true;
		}
		return false;
	}

	function render(err, res, content) {
        if (!isError(err, res)) {

            res.writeHead(200, {
				'Content-Type': '',
				'Pragma': 'public',
				'Cache-Control': 'private, max-age=10'
            });
            res.end(content, 'utf-8');
        }
    }

	app.get('/:id/:module/:filename', function(req, res) {

        var id = req.params.id,
			module = req.params.module,
            filename = req.params.filename;

        var filepath = path.resolve(__dirname, '../upload/' + id + '/' + module + '/' + filename);

        fs.exists(filepath, function(exists) {
			if (!exists) {
				render(exists, res);
			} else {
				fs.readFile(filepath, function(err, content) {
					if (err) {
						render(err, res);
					} else {
						render(null, res, content);
					}
				});
			}
		});
    });
};