var formidable = require('formidable');

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

//	var file = getFile(req.files);
//	console.log(file);

        const form = formidable({ multiples: true , uploadDir: __dirname + '../../upload'});

        form.parse(req, (err, fields, files) => {
            if (err) {
		console.log(err);
                next(err);
                return;
            }
            console.log(JSON.stringify(files, null, 2));
            console.log(JSON.stringify(fields, null, 2));
            res.json({ fields, files });
        });
    });
};
