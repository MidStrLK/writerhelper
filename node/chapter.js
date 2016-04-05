var mongodb = require("../mongo/mongodb");

exports.getChapter = getChapter;

function getChapter(data){
/* ПОЛУЧЕНИЕ */
    if (data.path[0] === 'getchapter' && data.path.length === 2) {
        var callbackWrapper = function(err, result){
            if(result && result instanceof Array && result.length && result.length === 1) result = result[0];
            data.callback(err, result);
        };
        mongodb.requestMDB('select', callbackWrapper, {id: data.path[1]}, data.COLLECTION);

/* СОЗДАНИЕ */
    }else if (data.path[0] === 'postchapter') {
        if(data.data && data.data.id && data.data.id.indexOf('chapter') !== -1){
            if(data.data) data.data.datechange = Date.now();
            mongodb.requestMDB('update',data.callback, data.data,  data.COLLECTION)
        }else{
            createChapter(data.data, data.callback, data.COLLECTION)
        }

/* УДАЛЕНИЕ */
    }else if (data.path[0] === 'removechapter' && data.path.length === 2) {
        mongodb.requestMDB('remove', data.callback, {id: data.path[1]}, data.COLLECTION);
    }
}

/* Создает краткое описание книги */
function createChapter(data, callback, COLLECTION){
    var datebegChapter = Date.now() + 10,
        data1 = {
            id: 'chapter_' + datebegChapter,
            bookid: data.bookid,
            inkId: data.id,
            datebeg: datebegChapter,
            datechange: datebegChapter,
            label: 'Глава',
            type: 'chapter'
        };

    mongodb.requestMDB('insert', callback, data1, COLLECTION);
}