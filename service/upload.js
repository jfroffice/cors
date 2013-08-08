var fs = require('fs'),
    mkdirp = require('mkdirp'),
	path = require('path');

exports.init = function(app) {

 	function getFile(files) {
        if (files.file) {
            return files.file;
        } else if (files.files) {
            return files.files[0];
        } else {
            return null;
        }
    }

  	app.post('/upload', function(req, res) {

		var file = getFile(req.files),
            data = JSON.parse(req.body.data),
            dst = '../upload/';

        if (!file) {
            res.send({ err: 'no files received'});
            return;
        }

        // check if id in allow ?
        // if not refuse CORS
        if (data) {
            var id = data.id,
                module = data.module,
                filename = data.filename || file.name;

            if (id) {
                dst += id + '/';
            }

            if (module) {
                dst += module + '/';
            }
        }

        var root = path.resolve(__dirname, dst),
            newPath = path.resolve(__dirname, dst + filename);

        mkdirp.sync(root);

		fs.rename(file.path, newPath, function (err) {
			if (err) throw err;

            var resp = {};
            if (req.body.data) {
                resp.data = data;
                resp.path = newPath;
            }
		  	res.send(resp);
		});
   });
};