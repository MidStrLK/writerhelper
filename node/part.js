var mongodb = require("../mongo/mongodb");

exports.getPart = getPart;

function getPart(data){
/* ПОЛУЧЕНИЕ */
    if (data.path[0] === 'getpart' && data.path.length === 2) {

        mongodb.requestMDB('select', data.callback, {id: data.path[1]}, data.COLLECTION);

/* СОЗДАНИЕ */
    }else if (data.path[0] === 'postpart') {
        if(data.data && data.data.id){
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
            label: 'Часть',
            type: 'part'
        },{
            id: 'chapter_' + datebegChapter,
            bookid: id,
            inkId: 'part_' + datebegPart,
            datebeg: datebegChapter,
            label: 'Глава',
            type: 'chapter'
        }];

    mongodb.requestMDB('insert', callback, data, COLLECTION);
}