var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

exports.init = function(app) {
    function getFile(files) {
        if (files.file) {
            return files.file;
        }

        if (files.files) {
            return files.files[0];
        }
    }

    app.post('/', function(req, res) {

        const form = formidable({ multiples: true , uploadDir: path.resolve(__dirname, './upload')});

        form.parse(req, (err, fields, files) => {
            if (err) {
		        console.log(err);
                next(err);
                return;
            }

            // Why not do a restriction according file size !!
            // NO MORE than 1 Mo

            console.log(JSON.stringify(files, null, 2));
            console.log(JSON.stringify(fields, null, 2));

            const file = getFile(files);
            if (!file) {
                res.send({ err: 'no files received'});
                return;
            }

            let filename;

            if (!fields || !fields.data) {
                filename = 'get/' + path.basename(file.path);
            } else {
                const { id, module } = JSON.parse(fields.data);
                let dirfile = './upload/' + id + '/' + module + '/';
                filename = id + '/' + module + '/' + file.name;

                var root = path.resolve(__dirname, dirfile),
                    newPath = path.resolve(__dirname, dirfile + file.name);

                console.log(root);
                console.log(newPath);

                mkdirp.sync(root);

                // TODO change the destination file if it exist or overwrite it ?!
                fs.rename(file.path, newPath, function (err) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                });
            }

            res.send({
                url: req.protocol + '://' + req.headers.host + '/' + filename
            });
        });
    });
};
