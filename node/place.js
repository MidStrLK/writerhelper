var mongodb = require("../mongo/mongodb");

exports.getPlace = getPlace;

function getPlace(data){
/* ПОЛУЧЕНИЕ */
    if (data.path[0] === 'getplace' && data.path.length === 2) {
        var callbackWrapper = function(err, result){
            if(result && result instanceof Array && result.length && result.length === 1) result = result[0];
            data.callback(err, result);
        };
        mongodb.requestMDB('select', callbackWrapper, {id: data.path[1]}, data.COLLECTION);

/* СОЗДАНИЕ */
    }else if (data.path[0] === 'postplace') {
        if(data.data && data.data.id){
            mongodb.requestMDB('update',data.callback, data.data,  data.COLLECTION)
        }else{
            createPlace(data.data, data.callback, data.COLLECTION)
        }

/* УДАЛЕНИЕ */
    }else if (data.path[0] === 'removeplace' && data.path.length === 2) {
        mongodb.requestMDB('remove', data.callback, {id: data.path[1]}, data.COLLECTION);
    }
}

/* Создает краткое описание книги */
function createPlace(data, callback, COLLECTION){
    data.id = 'place_' + Date.now();
    data.datebeg = Date.now();
    data.type = 'places';

    mongodb.requestMDB('insert', callback, data, COLLECTION);
}