//Lets require/import the HTTP module
var http = require('http');
var url = require('url');
var predictor = require('./predictiveservices');
var metaDataExtractor = require('./metaDataExtractor');

//Lets define a port we want to listen to
const PORT = 4567;

//We need a function which handles requests and send response
function handleRequest(request, response) {
    try {
            if (req.method === 'OPTIONS') {
                console.log('!OPTIONS');
                var headers = {};
                // IE8 does not allow domains to be specified, just the *
                // headers["Access-Control-Allow-Origin"] = req.headers.origin;
                headers["Access-Control-Allow-Origin"] = "*";
                headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
                headers["Access-Control-Allow-Credentials"] = false;
                headers["Access-Control-Max-Age"] = '86400'; // 24 hours
                headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
                res.writeHead(200, headers);
                res.end();
            } else {
                    var url_parts = url.parse(request.url, true);
                    var meta = metaDataExtractor.getMetaData(query.meta);
                    predictor.predictByMeta(meta, function (data) {
                        response.end('It Works!' + data);
                    });
            }
    } catch (err) {
        console.log(err);
        response.end('smth went wrong');
    }
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});