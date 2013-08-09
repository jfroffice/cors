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

    app.post('/', function(req, res) {

		var file = getFile(req.files),
            data = req.body.data ? JSON.parse(req.body.data) : null,
            dst = '../upload/';

        if (!file) {
            res.send({ err: 'no files received'});
            return;
        }

        // check if id in allow ?
        // if not refuse CORS
        var filename;

        if (data) {
            filename = data.id + '/' + data.module + '/' + (data.filename || file.name);

            var root = path.resolve(__dirname, dst),
                newPath = path.resolve(__dirname, dst + filename);

            mkdirp.sync(root);

            fs.rename(file.path, newPath, function (err) {
                if (err) throw err;
            });
        } else {
            filename = 'get/' + path.basename(file.path);
        }

        res.send({
            url: 'http://' + req.headers.host + '/' + filename
        });
   });
};