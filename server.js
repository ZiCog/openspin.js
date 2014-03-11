// Import required modules and wire them up
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);

var fs = require('fs');

// Regular expression to match file names like "/fileName_1-2.spin"
var REG_EXP_SPIN_FILE = /^\/[a-z,A-Z,0-9,\-,_]+[.]spin$/
var REG_EXP_BINARY_FILE = /^\/[a-z,A-Z,0-9,\-,_]+[.]binary$/

// Log http requests 
app.use(express.logger());

// We want to parse bodies when uploading files.
app.use(express.bodyParser());


// EXAMPLE OF MULTIPLE PARAMETERS:
app.get('/fruit/:fruitName/:fruitColor', function(request, response) {
    /* return the response JSON data as above using request.params.fruitName and 
       request.params.fruitColor to fetch the fruit apple and update its color to red*/
});  

app.get("/project/:file", function(req, res) {
    // Fun fact: this has security issues
    // Open a read stream from the target file
    var fileName = './project/' + req.params.file;

    var readStream = fs.createReadStream(fileName);

    // Pipe data from file into response
    readStream.pipe(res);

    // After all the data is saved, respond with a 200 
    readStream.on('end', function () {
        //res.writeHead(200);
        //res.end();
    });

    // Handle any errors on the stream
    readStream.on('error', function (err) {
        console.log(err);
        res.send(404);
    });
});

app.get("/library/:file", function(req, res) {
    // Fun fact: this has security issues
    // Open a read stream from the target file
    var fileName = './library/' + req.params.file;

    var readStream = fs.createReadStream(fileName);

    // Pipe data from file into response
    readStream.pipe(res);

    // After all the data is saved, respond with a 200 
    readStream.on('end', function () {
        //res.writeHead(200);
        //res.end();
    });

    // Handle any errors on the stream
    readStream.on('error', function (err) {
        console.log(err);
        res.send(404);
    });
});

// Serve static files from "public" directory 
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/js'));

// Serve an index page
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

/**
 * HTTP PUT /{fNNilename}.spin
 * Param: Name of file to save. (No :xxx params)
 * Body: Contents of file to save. 
 * Returns: 200 HTTP code
 * Error: 404 HTTP code if the task doesn't exists
 */
app.put("/project/:file", function (req, res) {

    var fileName = './project/' + req.params.file;

    // Open a stream into the target file
    var writeStream = fs.createWriteStream(fileName);

    // Pipe data from request into file
    req.pipe(writeStream);

    // After all the data is saved, respond with a 200 
    req.on('end', function () {
        res.writeHead(200);
        res.end();
    });

    // Handle any errors on the stream
    writeStream.on('error', function (err) {
        console.log(err);
        res.send(403);
    });
});

// Any other request gets this
app.use(function(req, res){
    console.log(req.url);
    console.log("WTF");
    res.send(404);
});

// Handle web socket connections
io.sockets.on('connection', function (socket) {
    // Send hello message to all new socket connections
    socket.emit('hello', { hello: 'world' });
   
    // Just log socket client messages
    socket.on('message', function (data) {
        console.log(data);
    });
});

// Start listening
server.listen(3000);
console.log('Listening on port 3000');





