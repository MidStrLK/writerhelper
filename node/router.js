var fs = require("fs"),
    res;

function route(handle, pathname, response, postData, COLLECTION) {

    if(postData && typeof postData === 'string') postData = JSON.parse(postData);

  if(pathname.indexOf('.js') !== -1){
    res = fs.readFileSync('.' + pathname);

    response['writeHead'](200, {'Content-Type': 'application/javascript'});
    response.end(res);


  }else if(pathname.indexOf('.css') !== -1){
    res = fs.readFileSync('.' + pathname);
    response['writeHead'](200, {'Content-Type': 'text/css'});
    response.end(res);


  }else if(pathname.indexOf('.png') !== -1){
    res = fs.readFileSync('.' + pathname);
    response['writeHead'](200, {'Content-Type': 'image/png'});
    response.end(res);


  }else if(pathname.indexOf('.jpg') !== -1){
    res = fs.readFileSync('.' + pathname);
    response['writeHead'](200, {'Content-Type': 'image/jpeg'});
    response.end(res);


  } else if(pathname.indexOf('.') !== -1){
      response['writeHead'](404, {"Content-Type": "text/plain"});
      response.write("404 Not found");
      response.end();
  }else  if (typeof handle === 'function') {
        handle(response, handle, pathname, postData, COLLECTION);


  } else {
        response['writeHead'](404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
  }
}

exports.route = route;