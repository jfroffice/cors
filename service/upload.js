var fs = require('fs'),
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

		var file = getFile(req.files);

        console.log(req.body);

        if (!file) {
            res.send({ err: 'no files received'});
            return;
        }

        var newPath = path.resolve(__dirname, '../upload/' + file.name);

		fs.rename(file.path, newPath, function (err) {
			if (err) throw err;

            var resp = {};
            if (req.body.data) {
                resp.data = JSON.parse(req.body.data);
            }
		  	res.send(resp);
		});
   });
};