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

        if (!file) {
            res.send({ result: 'KO'});
            return;
        }

        console.log(file);

        var newPath = path.resolve(__dirname, '../upload/' + FILENAME);

		fs.rename(file.path, newPath, function (err) {
			if (err) throw err;
		  	res.send({ result: 'OK'});
		});
   });
};