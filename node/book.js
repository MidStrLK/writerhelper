var mongodb = require("../mongo/mongodb");

exports.getBook = getBook;

function getBook(data){

/* ПОЛУЧЕНИЕ КРАТКОГО ОПИСАНИЯ КНИГИ */
    if (data.path[0] === 'getbookdescription' && data.path.length === 2) {
        var callbackDescription = function(err, result){
            createDescriptionResponce(err, result, data.callback);
        };
        mongodb.requestMDB('select', callbackDescription, {bookid: data.path[1] || null}, data.COLLECTION);

/* ПОЛУЧЕНИЕ СПИСКА КНИГ */
    }else if (data.path[0] === 'getbook' && data.path.length === 1) {
        mongodb.requestMDB('select', data.callback, {type: 'book'}, data.COLLECTION);

/* ПОЛУЧЕНИЕ ПОЛНОЙ ВЕРСИИ КНИГИ */
    }else if (data.path[0] === 'getbook' && data.path.length === 2) {
        mongodb.requestMDB('getfullbook', data.callback, {id: data.path[1]}, data.COLLECTION);

/* СОЗДАНИЕ КНИГИ */
    }else if (data.path[0] === 'postbook') {
        if(data.data && data.data.id){
            updateBook(data.data, data.callback, data.COLLECTION)
        }else{
            createBook(data.data, data.callback, data.COLLECTION)
        }

/* УДАЛЕНИЕ КНИГИ */
    }else if (data.path[0] === 'removebook' && data.path.length === 2) {
        mongodb.requestMDB('remove', data.callback, {id: data.path[1]}, data.COLLECTION);
    }
}

/* Cоздает краткое описание книги и отправляет обратно */
function createDescriptionResponce(err, result, callback){
    var res = {};

    if(err){
        callback(err, result);
    }else{
        result.forEach(function(val){
            if(val.type === 'book') {
                res = {
                    id:         val.id,
                    label:      val.label,
                    note:       val.note,
                    datebeg:    val.datebeg,
                    part:       0,
                    chapter:    0,
                    heroes:     0,
                    places:     0,
                    reminders:  0
                }
            }
        });

        result.forEach(function(val){
            if(val.type !== 'book') res[val.type]++;
        });

        callback(err, res);
    }


}

/* Сохраняет краткое описание книги */
function updateBook(data, callback, COLLECTION){
    /*var func = function(err, result){
        if(!err){
            mongodb.requestMDB('postbook', callback, data, COLLECTION);
        }else{
            callback(err, result)
        }
    };*/

    var selectCallback1 = function(err, result){
        if(!err){
            var res = result[0];
            if(data.label && data.label !== res.label) res.label = data.label;
            if(data.note  && data.note  !== res.note)  res.note  = data.note;

            var removeCallback = function(err, result){
                if(!err){
                    mongodb.requestMDB('postbook', callback, res, COLLECTION);
                }else{
                    callback(err, result)
                }
            };

            mongodb.requestMDB('remove', removeCallback, {id: data.id}, COLLECTION);

        }else{
            callback(err, result)
        }
    };

    mongodb.requestMDB('select', selectCallback1, {id: data.id}, COLLECTION);
    //mongodb.requestMDB('remove', func, {type: 'book', id: data.id}, COLLECTION);
}

/* Создает краткое описание книги */
function createBook(data, callback, COLLECTION){
    data.bookid = data.id;
    data.datebeg = Date.now();
    mongodb.requestMDB('postbook', callback, data, COLLECTION);
}