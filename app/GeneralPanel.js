Ext.define('APP.GeneralPanel' , {
	extend: 'Ext.panel.Panel',
	alias: 'widget.GeneralPanel',

    name: 'GeneralPanel',

    /* При загрузке CompositionPanel получаем список книг из БД */
    getBookList: function(){
        var me = this;

        APP.utils.submitRequest('/getbook', {successfunc: me.addBookButtons, scope: this});
    },

    /* Добавляем кнопки книг на панель */
    addBookButtons: function(data){
        var me = this;

        me.removeAll();
        if(data && data.forEach){
            data.forEach(function(val){
                me.add({
                    xtype: 'button',
                    name: val.id,
                    text: val.label,
                    handler: function(btn, event){
                        me.getBookDescription(val.id);
                    },
                    width: '100%',
                    cls: 'books-button'
                })
            })
        }

        me.add({
            xtype: 'button',
            text: 'Новая книга',
            width: '100%',
            margin: '20 0 40 0',
            cls: 'books-button books-button-add',
            handler: function(btn, event){
                me.createBook();
            }
        });

        me.add({
            xtype: 'button',
            text: 'УДАЛИТЬ ВСЕ',
            width: '100%',
            cls: 'books-button books-button-add',
            handler: function(btn, event){
                APP.utils.submitRequest('removeall');
                me.getBookList();
            }
        })

    },

    /* Получить краткое описание книги */
    getBookDescription: function(id){
        if(!id) return;

        APP.utils.submitRequest('/getbookdescription/' + id, {successfunc: this.showBookDescription, scope: this})
        //APP.utils.submitRequest('/getbookdescription/' + id, {successfunc: this.showBookDescription, scope: this})
    },

    /* Отобразить краткое описание книги */
    showBookDescription: function(data){
        if(!data) return;

        var panel = this.getSummaryPanel(),
            bookEditor = Ext.create('APP.Summary.bookEditor');

        panel.removeAll();
        var bookEditorPanel = panel.add(bookEditor);
        bookEditorPanel.displayData(data);
    },

    /* Запрос данных книги для редактирования */
    getBook:function(id){
        if(!id) return;

        APP.utils.submitRequest('/getbook/' + id, {successfunc: this.createBookTree, scope: this})
    },


    createBook: function(data){
        var panel = this.getSummaryPanel(),
            bookEditor = Ext.create('APP.Summary.bookEditor');

        panel.removeAll();
        panel.add(bookEditor);
    },

    /*createBookButtons: function(data){
        if(!data || !data.length || !data.forEach) return;

        var me = this,
            res = [];
        data.forEach(function(val){
            res.push({
                xtype: 'button',
                name: val.id,
                text: val.label,
                handler: function(btn, event){
                    me.getBook(val.id);
                }
            })
        });

        this.removeAll();
        this.add({
            xtype: 'container',
            layout: 'vbox',
            defaults:{
                margin: 10
            },
            items: [
                {
                    xtype: 'container',
                    defaults:{
                        margin: 10
                    },
                    items: res
                },{
                    xtype: 'button',
                    name: 'addBook',
                    text: 'Добавить книгу',
                    handler: function(btn, event){
                        me.editBook();
                    }
                }
            ]
        });
    },*/



    createBookTree: function(data){
        var book = {
                text: 'Книга',
                type: 'allbook',
                expanded: true,
                children: []
            },
            heroes = {
                text: 'Герои',
                type: 'allheroes',
                expanded: true,
                children: []
            },
            places = {
                text: 'Места',
                type: 'allplaces',
                expanded: true,
                children: []
            },
            reminders = {
                text: 'Напоминания',
                type: 'allreminders',
                expanded: true,
                children: []
            },
            root = {
                expanded: true,
                children: [book,heroes,places,reminders]
            },
            treeStore = this.getTreePanel().getStore();

        data['book'][0]['parts'].forEach(function(val){

            var chapters = [];

            val['chapters'].forEach(function(chVal){
                chapters.push({
                    bookid: chVal.bookid,
                    id: chVal.id,
                    inkId: chVal.inkId,
                    text: chVal.label,
                    type: chVal.type,
                    note: val.note,
                    leaf: true
                })
            });

            book.children.push({
                bookid: val.bookid,
                id: val.id,
                inkId: val.inkId,
                text: val.label,
                type: val.type,
                note: val.note,
                children: chapters
            })
        });

        data['heroes'].forEach(function(val){
            heroes.children.push({
                bookid: val.bookid,
                id: val.id,
                inkId: val.inkId,
                text: val.label,
                type: val.type,
                note: val.note,
                leaf: true
            })
        });

        data['places'].forEach(function(val){
            places.children.push({
                bookid: val.bookid,
                id: val.id,
                inkId: val.inkId,
                text: val.label,
                type: val.type,
                note: val.note,
                leaf: true
            })
        });

        data['reminders'].forEach(function(val){
            reminders.children.push({
                bookid: val.bookid,
                id: val.id,
                inkId: val.inkId,
                text: val.label,
                type: val.type,
                note: val.note,
                leaf: true
            })
        });

        treeStore.setRootNode(root);

    },

    treeClick: function(self, record, item){
       var data = record.getData(),
           id = data.id,
           type = data.type,
           note = data.note;

        console.log('treeClick',id, type);

    },


    getSummaryPanel: function(){
        return this.up('desktop').down('SummaryPanel');
    },
    getCompositionPanel: function(){
        return this.up('desktop').down('CompositionPanel');
    },
    getTextPanel: function(){
        return this.up('desktop').down('TextPanel');
    },
    getTreePanel: function(){
        return this.up('desktop').down('CompositionTree');
    }

});