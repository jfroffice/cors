Node-Express-Upload-Cors
========================
Node Express Upload Cors is a simple server to provide upload service.
Following the guideline of [nobackend.org](http://nobackend.org/), it allows to any web apps to upload file to your server.

Nevertheless, it also allow dynamic image resize operation and best strategies to reduce image size.

How to install
--------------
```
git clone https://github.com/jfroffice/cors
```

How to start
------------
```
npm install
node app.js
```

How to configure
----------------
Change ```config.js``` file to specify following parameters:
```
port: 8001,
cors: {
    origin: '*'
}
```
```origin``` describe origin policy your server will allow, by default it will allow any address which might be consider as big security hole.

How to use it
-------------
After deploying this server, the only thing to do is to use HTML5 upload API to upload data on your server.

One implementation might be [jquery.upload](https://github.com/jfroffice/jquery.upload)

Licence
-------
MIT

Credits
-------
http://www.html5rocks.com/en/tutorials/cors/

