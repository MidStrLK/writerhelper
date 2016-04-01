var server 			= require("./node/server"),
	router 			= require("./node/router"),
	requestHandlers = require("./node/requestHandlers");

server.start(router.route, requestHandlers.submitRequest);