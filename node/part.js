var mongodb = require("../mongo/mongodb");

exports.getPart = getPart;

function getPart(data){
/* ПОЛУЧЕНИЕ */
    if (data.path[0] === 'getpart' && data.path.length === 2) {
        var callbackWrapper = function(err, result){
            if(result && result instanceof Array && result.length && result.length === 1) result = result[0];
            data.callback(err, result);
        };
        mongodb.requestMDB('select', callbackWrapper, {id: data.path[1]}, data.COLLECTION);

/* СОЗДАНИЕ */
    }else if (data.path[0] === 'postpart') {
        if(data.data && data.data.id){
            if(data.data) data.data.datechange = Date.now();
            mongodb.requestMDB('update',data.callback, data.data,  data.COLLECTION)
        }else{
            createPart(data.path[1], data.callback, data.COLLECTION)
        }

/* УДАЛЕНИЕ */
    }else if (data.path[0] === 'removepart' && data.path.length === 2) {
        mongodb.requestMDB('remove', data.callback, {id: data.path[1]}, data.COLLECTION);
    }
}

/* Создает краткое описание книги */
function createPart(id, callback, COLLECTION){
    var datebegPart = Date.now(),
        datebegChapter = Date.now() + 10,
        data = [{
            id: 'part_' + datebegPart,
            bookid: id,
            inkId: id,
            datebeg: datebegPart,
            datechange: datebegPart,
            label: 'Часть',
            type: 'part'
        },{
            id: 'chapter_' + datebegChapter,
            bookid: id,
            inkId: 'part_' + datebegPart,
            datebeg: datebegChapter,
            datechange: datebegChapter,
            label: 'Глава',
            type: 'chapter'
        }];

    mongodb.requestMDB('insert', callback, data, COLLECTION);
}