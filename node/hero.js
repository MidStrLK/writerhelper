var mongodb = require("../mongo/mongodb");

exports.getHero = getHero;

function getHero(data){

/* ПОЛУЧЕНИЕ СПИСКА КНИГ */
    if (data.path[0] === 'getbook' && data.path.length === 1) {
        mongodb.requestMDB('select', data.callback, {type: 'book'}, data.COLLECTION);

/* ПОЛУЧЕНИЕ Героя */
    }else if (data.path[0] === 'gethero' && data.path.length === 2) {

        mongodb.requestMDB('select', data.callback, {id: data.path[1]}, data.COLLECTION);

/* СОЗДАНИЕ КНИГИ */
    }else if (data.path[0] === 'posthero') {
        if(data.data && data.data.id){
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
    data.type = 'heroes';

    mongodb.requestMDB('insert', callback, data, COLLECTION);
}