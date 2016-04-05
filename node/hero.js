var mongodb = require("../mongo/mongodb");

exports.getHero = getHero;

function getHero(data){

/* ПОЛУЧЕНИЕ Героя */
    if (data.path[0] === 'gethero' && data.path.length === 2) {

        var callbackWrapper = function(err, result){
            if(result && result instanceof Array && result.length && result.length === 1) result = result[0];
            data.callback(err, result);
        };

        mongodb.requestMDB('select', callbackWrapper, {id: data.path[1]}, data.COLLECTION);

/* СОЗДАНИЕ КНИГИ */
    }else if (data.path[0] === 'posthero') {
        if(data.data && data.data.id){
            if(data.data) data.data.datechange = Date.now();
            mongodb.requestMDB('update',data.callback, data.data,  data.COLLECTION)
        }else{
            createHero(data.data, data.callback, data.COLLECTION)
        }

/* УДАЛЕНИЕ КНИГИ */
    }else if (data.path[0] === 'removehero' && data.path.length === 2) {
        mongodb.requestMDB('remove', data.callback, {id: data.path[1]}, data.COLLECTION);
    }
}

/* Создает краткое описание книги */
function createHero(data, callback, COLLECTION){
    data.id = 'hero_' + Date.now();
    data.datebeg = Date.now();
    data.datechange = Date.now();
    data.type = 'heroes';

    mongodb.requestMDB('insert', callback, data, COLLECTION);
}