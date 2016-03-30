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
        var callbackFullBook = function(err, result){
            createFullBookResponce(err, result, data.callback);
        };
        mongodb.requestMDB('select', callbackFullBook, {bookid: data.path[1]}, data.COLLECTION);

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

/* Создает полную версию книги */
function createFullBookResponce(err, result, callback){
    if(err){
        callback(err, result);
    }else {
        var res = {},
            parts = [],
            chapters = [];

        /*/!* Найдем объект - книгу *!/
        result.forEach(function (val) {
            if (val.type === 'book') res = val;
        });*/

        /*if(!res){
            callback('Книга не найдена', 'Книга не найдена');
            return;
        }*/

        /* Вставим в нее героев, места и напоминания */
        result.forEach(function (val) {
            if (val.type === 'book') {
                res.book = val;
            }else if (val.type === 'heroes') {
                if (!res.heroes) res.heroes = [];
                res.heroes.push(val);
            }else if (val.type === 'places') {
                if (!res.places) res.places = [];
                res.places.push(val);
            }else if (val.type === 'reminders') {
                if (!res.reminders) res.reminders = [];
                res.reminders.push(val);
            }else if (val.type === 'part') {
                parts.push(val);
            }else if (val.type === 'chapter') {
                chapters.push(val);
            }
        });

        /* Добавим части */
        if(res.book.parts && res.book.parts.forEach){
            parts.forEach(function (valParts) {
                res.book.parts.forEach(function(valRes, keyRes){
                    if(valParts.id === valRes) res.book.parts[keyRes] = valParts;
                })
            })
        }

        /* Добавим главы */
        if(res.book.parts && res.book.parts.forEach){
            chapters.forEach(function (valChapters) {
                res.book.parts.forEach(function(valPart, keyPart){
                    if(valPart.chapters && valPart.chapters.forEach){
                        valPart.chapters.forEach(function(valChapt, keyChapt){
                            if(valChapters.id === valChapt) res['book']['parts'][keyPart]['chapters'][keyChapt] = valChapters;
                        })
                    }
                })
            })
        }


        callback(err, res);
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