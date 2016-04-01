var http                = require("http"),
    url                 = require("url"),
    mongodb             = require("../mongo/mongodb"),
	server_port         = process.env['OPENSHIFT_NODEJS_PORT'] || 3004,
	server_ip_address   = process.env['OPENSHIFT_NODEJS_IP']   || '127.0.0.1',
    COLLECTION;

function routeRouter(route, handle, pathname, response, postData){
    if(COLLECTION){
        route(handle, pathname, response, postData, COLLECTION);
    }else{
        mongodb.getCollectionMDB(function(COLL){
            COLLECTION = COLL;
            routeRouter(route, handle, pathname, response, postData)
        })
    }
}

function start(route, handle) {
  function onRequest(request, response) {
      var postData = "";
      var pathname = url.parse(request.url).pathname;
      //console.log("--" + pathname);

      request['setEncoding']("utf8");

      request.addListener("data", function (postDataChunk) {
          postData += postDataChunk;
      });

      request.addListener("end", function () {
          routeRouter(route, handle, pathname, response, postData);
      });

  }
 
	var server = http.createServer(onRequest);
	server.listen(server_port, server_ip_address, function () {
		console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
	});

}

exports.start = start;