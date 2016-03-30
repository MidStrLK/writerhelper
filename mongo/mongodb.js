// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/compareweather';
// if OPENSHIFT env variables are present, use the available connection info:

if(process && process.env && process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}

var mongo = require('mongodb').MongoClient,
    opendb,
    openconnection = [],
    name = 'weather';



	
exports.requestMDB       = requestMDB;
exports.getCollectionMDB = collectionMongo;



/*-------------------------------------------------------------------------------------------------------------------*/

/*--- ВЫСШИЙ УРОВЕНЬ ---*/

/* Главный запрос к БД, запускает нужные ф-ции */
function requestMDB(path, callback, data, COLLECTION){
console.log('-MDB_request-', path);

    if(typeof data === 'string') data = JSON.parse(data);

          if(path === 'getbook'){
        selectDB(data, callback, COLLECTION)
    }else if(path === 'postbook'){
        postBook(data, callback, COLLECTION);
    }else if(path === 'getfullbook'){
        getFullBook(data.id, callback, COLLECTION);
    }else if(path === 'remove') {
        removeDB(data, callback, COLLECTION);
    }else if(path === 'select'){
        selectDB(data, callback, COLLECTION)
    }else if(path === 'update'){
        updateDB(data, callback, COLLECTION)
    }else if(path === 'insert') {
        insertDB(data, callback, COLLECTION);
    }



    //
    //if(path === 'insert'){
    //    insertDB(data, callback, COLLECTION);
    //
    //}else if(path === 'count'){
    //    selectDB(null, callback, COLLECTION)
    //
    //}else if(path === 'select'){
    //    selectDB(data, callback, COLLECTION)
    //
    //}
}

function getFullBook(id, callback, COLLECTION){
    var func = function(err, result){

        //console.info('result - ',result);

        if(!err && result && result.forEach){
            var res = {};

            result.forEach(function(val){
                if(val.type === 'chapter') {
                    result.forEach(function(partVal, partKey){
                        if(partVal.type === 'part' && val.inkId === partVal.id){
                            partVal.chapters.forEach(function(chapterVal, chapterKey){
                                if(chapterVal === val.id) result[partKey].chapters[chapterKey] = val;
                            })
                        }
                    })
                }
            });

            result.forEach(function(val){
                if(val.type !== 'chapter' && val.type !== 'part') {
                    if(!res[val.type]) res[val.type] = [];
                        res[val.type].push(val);
                }
            });

            result.forEach(function(val){
                if(val.type === 'part') {
                    res['book'][0]['parts'].forEach(function(partVal, partKey){
                        if(partVal === val.id) res['book'][0]['parts'][partKey] = val;
                    })
                }
            });



        }
        console.info('res - ',res);

        callback(err, res);
    };

    selectDB({bookid: id}, callback, COLLECTION);
}

function postBook(data, callback, COLLECTION){
    data.type = 'book';
    if(!data.id) {
        var partId      = createId('part'),
            chapterId   = createId('chapter'),
            heroId      = createId('hero'),
            placeId     = createId('place'),
            remindId    = createId('remind');

        data.id = createId('book');
        data.bookid = data.id;
        data.parts = [partId];

        var ins = [
            data,
                {
                    type: 'part',
                    bookid: data.id,
                    inkId: data.id,
                    label: 'Часть 1',
                    chapters:[chapterId],
                    id: partId
                },{
                    type: 'chapter',
                    bookid: data.id,
                    inkId: partId,
                    label: 'Глава 1',
                    id: chapterId
                },{
                    type: 'heroes',
                    bookid: data.id,
                    inkId: data.id,
                    label: 'Герой',
                    id: heroId
                },{
                    type: 'places',
                    bookid: data.id,
                    inkId: data.id,
                    label: 'Место',
                    id: placeId
                },{
                    type: 'reminders',
                    bookid: data.id,
                    inkId: data.id,
                    label: 'Напоминание',
                    id: remindId
                }

        ];
        insertDB(ins, callback, COLLECTION);
    }else{
        var removeCallback = function(){
            insertDB(data, callback, COLLECTION);
        };

        removeDB({id: data.id}, removeCallback, COLLECTION)
    }


}

function createId(data) {
    return data + '_' + Date.now();
}

/*--- ВЫСШИЙ УРОВЕНЬ ---*/

/*-------------------------------------------------------------------------------------------------------------------*/

/*--- СРЕДНИЙ УРОВЕНЬ ---*/

/* Вставляем данные в БД */
function insertDB(data, callback, COLLECTION){
    if(!COLLECTION && openconnection[name]) COLLECTION = openconnection[name];

    if(!COLLECTION || !COLLECTION.insert){
        collectionMongo(function(){
            insertDB(name, data);
        })
    }else{
        if(!callback) callback = function(err, result){
            console.info('-MDB_reply- insert - err:', err, ', result: ', (result && result.length) ? result.length : '');
        };
        console.info('insertDB - ',data);
        COLLECTION.insert(data, callback);
    }
}

/* Получаем данные из БД */
function selectDB(data, callback, COLLECTION){
    if(!COLLECTION && openconnection[name]) COLLECTION = openconnection[name];
    if(!COLLECTION || !COLLECTION.find){
        collectionMongo(function(){
            selectDB(data, callback);
        })
    }else{
        var cursor = COLLECTION.find(data);
        if(data === null){
            console.info('-MDB_reply- count');
            if(callback) countCategory(cursor, callback);
            //cursor.count(function(err, docs) {
            //    if(callback) callback(err, countCategory(docs));
            //});
        }else{
            cursor.toArray(function(err, result) {
                console.info('-MDB_reply- select - err:', err, ', result: ', (result && result.length) ? result.length : '');
                if(callback) callback(err, result);
            });
        }

    }
}

/* Удаление записей из БД */
function removeDB(data, callback, COLLECTION){
    if(!COLLECTION && openconnection[name]) COLLECTION = openconnection[name];

    if(!COLLECTION || !COLLECTION.remove){
        collectionMongo(function(){
            removeDB(data, callback);
        })
    }else{
        if(data){
            COLLECTION.remove(data, callback)
        }else COLLECTION.remove(callback)
    }
}

function updateDB(data, callback, COLLECTION){
    if(!COLLECTION && openconnection[name]) COLLECTION = openconnection[name];

    if(!COLLECTION || !COLLECTION.remove){
        collectionMongo(function(){
            updateDB(data, callback);
        })
    }else{
        var selectCallback = function(err, result){
            if(!err){
                var res = result[0];

                for(var key in data){
                    if(!res[key] || res[key] !== data.key) res[key] = data[key];
                }

                if(res['_id']) delete res['_id'];

                var removeCallback = function(err, result){
                    if(!err){
                        insertDB(res, callback, COLLECTION);
                    }else{
                        callback(err, result)
                    }
                };

                removeDB({id: data.id}, removeCallback,  COLLECTION);

            }else{
                callback(err, result)
            }
        };

        selectDB({id: data.id}, selectCallback, COLLECTION);
    }


}

/*--- СРЕДНИЙ УРОВЕНЬ ---*/

/*-------------------------------------------------------------------------------------------------------------------*/

/*--- НИЗКИЙ УРОВЕНЬ ---*/

/* Подсчет кол-ва записей */
function countCategory(cursor, callback){
    var res = {error: []};
    cursor.each(function(err, val){
        if(val === null){
            callback(null, res);
        }else if(!val || !val.name || !val.daykey || err){
            res.error.push(val)
        }else{
            if(!res[val.name]) res[val.name] = {};
            if(!res[val.name][val.daykey]) res[val.name][val.daykey] = 0;
            res[val.name][val.daykey]++
        }
    });

}

/* Находим БД */
function connectMongo(callback){
    mongo.connect('mongodb://'+connection_string, function(err, db) {												// connect to database server
        console.info('-MDB- db connect - err:', err, ', result: ', !!db);
        if(!err) {
            opendb = db;
            callback();
        }
    });
}

/* Находим нужную коллекцию */
function collectionMongo(callback){

    if(!opendb){
        connectMongo(function(){
            collectionMongo(callback);
        })
    }else{
        opendb.collection(name, function(err, collectionref) {		// ссылки на коллекции
            console.info('-MDB- collection connect - err:', err, ', result: ', !!collectionref);
            if(!err){
                openconnection[name] = collectionref;
                callback(collectionref);
            }
        });
    }
}

/* Отключаемся от БД */
function disconnectMongo(db){
    db.close();															// close a database connection
}

/*--- НИЗКИЙ УРОВЕНЬ ---*/
