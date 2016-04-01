var mongodb = require("../mongo/mongodb");

exports.getReminder = getReminder;

function getReminder(data){
/* ПОЛУЧЕНИЕ */
    if (data.path[0] === 'getreminder' && data.path.length === 2) {

        mongodb.requestMDB('select', data.callback, {id: data.path[1]}, data.COLLECTION);

/* СОЗДАНИЕ */
    }else if (data.path[0] === 'postreminder') {
        if(data.data && data.data.id){
            mongodb.requestMDB('update',data.callback, data.data,  data.COLLECTION)
        }else{
            createReminder(data.data, data.callback, data.COLLECTION)
        }

/* УДАЛЕНИЕ */
    }else if (data.path[0] === 'removereminder' && data.path.length === 2) {
        mongodb.requestMDB('remove', data.callback, {id: data.path[1]}, data.COLLECTION);
    }
}

/* Создает краткое описание книги */
function createReminder(data, callback, COLLECTION){
    data.id = 'reminder_' + Date.now();
    data.datebeg = Date.now();
    data.type = 'reminders';

    mongodb.requestMDB('insert', callback, data, COLLECTION);
}