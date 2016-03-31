var mongodb     = require("../mongo/mongodb"),
    fs          = require("fs"),
    book        = require("./book.js"),
    hero        = require("./hero.js"),
    place       = require("./place.js"),
    reminder    = require("./reminder.js"),
    part        = require("./part.js"),
    index       = fs.readFileSync('./index.html');

function submitRequest(response, handle, pathname, postData, COLLECTION){
  if(!pathname || !response){
    response.writeHead(500, { 'Content-Type': 'application/json', 'charset':'utf-8' });
    response.write('Ошибка в запросе ' + pathname);
    response.end();
  }else{
    if(pathname === '/'){
      response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
      response.end(index);
    }else {

        pathname = (pathname[0] === '/') ? pathname.substr(1) : pathname;

      var path = pathname.split('/'),//pathname.replace(/\//g, ''),
          func = function (err, result) {
            var res = 0,
                httpsc = 200;
            if (err) {
              res = err;
              httpsc = 500;
            } else {
                if (result || result === 0) res = result;
                if (result && (result.result || result.result === 0)) res = result.result;
                if (result && result.result && (result.result.n || result.result.n === 0)) res = result.result.n;
                if(res instanceof Array && res.length === 1) res = res[0];
            }
            response.writeHead(httpsc, {'Content-Type': 'application/json', 'charset': 'utf-8'});
            response.write((typeof res === 'string') ? res : JSON.stringify(res));
            response.end();
          },
          dataForGet = {
              response:     response,
              handle:       handle,
              pathname:     pathname,
              path:         path,
              data:         postData,
              callback:     func,
              COLLECTION:   COLLECTION
          };

      if(path[0].indexOf('book') !== -1){
          book.getBook(dataForGet);
      }else if(path[0].indexOf('hero') !== -1){
          hero.getHero(dataForGet);
      }else if(path[0].indexOf('place') !== -1){
          place.getPlace(dataForGet);
      }else if(path[0].indexOf('reminder') !== -1){
          reminder.getReminder(dataForGet);
      }else if(path[0].indexOf('part') !== -1){
          part.getPart(dataForGet);
      }else if(path[0] === 'removeall'){
          mongodb.requestMDB('remove', func, null, COLLECTION)
      }else{
          response['writeHead'](500, {'Content-Type': 'application/json', 'charset': 'utf-8'});
          response['write']('Ошибка в запросе к БД ' + path);
          response['end']();
      }
    }
  }
}

exports.submitRequest       = submitRequest;