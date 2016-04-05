Ext.require([
    'APP.Summary.heroEditor',
    'APP.Summary.bookEditor',
    'APP.Summary.placeEditor',
    'APP.Summary.reminderEditor',
    'APP.Summary.partEditor',
    'APP.Summary.chapterEditor',
    'APP.utils'
]);

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

    getFullBook: function(id){
        if(!id) return;

        APP.utils.submitRequest('getbook/' + id, {successfunc: this.showFullBook, scope: this});
    },

    /* Запускает построение меню для книги */
    showFullBook:function(data){
        var summaryPanel = this.getSummaryPanel(),
            selectedElem = this.getSelectedElement(),
            selectedId;

        if(selectedElem && selectedElem.items && selectedElem.items[0] && selectedElem.items[0].id) {
            selectedId = selectedElem.items[0].id;
        }



        summaryPanel.removeAll();
        this.createBookTree(data);
        this.setSelectedElement(selectedId);

        this.setCompositionPanelTitle(data);
    },

    setCompositionPanelTitle: function(data){
        if( data &&
            data.book &&
            data.book.label &&
            this.getCompositionPanel &&
            this.getCompositionPanel() &&
            this.getCompositionPanel().setTitle){
                this.getCompositionPanel().setTitle(data.book.label)
        }
    },

    getSelectedElement: function(){
        var res = undefined;
        if(
            this &&
            this.getCompositionPanel &&
            this.getCompositionPanel() &&
            this.getCompositionPanel().down &&
            this.getCompositionPanel().down('treeview') &&
            this.getCompositionPanel().down('treeview').getSelectionModel &&
            this.getCompositionPanel().down('treeview').getSelectionModel() &&
            this.getCompositionPanel().down('treeview').getSelectionModel().getSelected &&
            this.getCompositionPanel().down('treeview').getSelectionModel().getSelected()){
                res = this.getCompositionPanel().down('treeview').getSelectionModel().getSelected();
        }

        return res;
    },

    setSelectedElement: function(elem){

        var treeView, record;

        if( this &&
            this.down &&
            this.down('treeview')){
                treeView = this.down('treeview');
        }

        if( elem &&
            treeView &&
            treeView.getStore &&
            treeView.getStore() &&
            treeView.getStore().getNodeById &&
            treeView.getStore().getNodeById(elem)){
                record = treeView.getStore().getNodeById(elem);
        }

        if( record &&
            treeView &&
            treeView.getSelectionModel &&
            treeView.getSelectionModel() &&
            treeView.getSelectionModel().select){
               treeView.getSelectionModel().select(record);
        }

        if(record){
            this.treeClick(this, record);
        }
    },

    createBookTree: function(data){
        var me = this,
            book = {
                text: 'Книга',
                type: 'book',
                id: 'bookroot',
                bookid: data.book.id,
                inkId: data.book.id,
                expanded: true,
                children: []
            },
            heroes = {
                text: 'Герои',
                type: 'heroes',
                cls: 'book-tree-add-button',
                id: 'heroesroot',
                bookid: data.book.id,
                inkId: data.book.id,
                expanded: true,
                children: []
            },
            places = {
                text: 'Места',
                type: 'places',
                id: 'placesroot',
                cls: 'book-tree-add-button',
                expanded: true,
                bookid: data.book.id,
                inkId: data.book.id,
                children: []
            },
            reminders = {
                text: 'Напоминания',
                type: 'reminders',
                id: 'remindersroot',
                cls: 'book-tree-add-button',
                bookid: data.book.id,
                inkId: data.book.id,
                expanded: true,
                children: []
            },
            root = {
                expanded: true,
                children: [book,heroes,places,reminders]
            },
            compositionPanel = this.getCompositionPanel();

        compositionPanel.removeAll();
        var CompositionTree = compositionPanel.add(Ext.create(APP.Composition.CompositionTree)),
            treeStore = CompositionTree.getStore();

        if(!Ext.info)       Ext.info           = {};
        if(data.heroes)     Ext.info.heroes    = data.heroes;
        if(data.reminders)  Ext.info.reminders = data.reminders;
        if(data.places)     Ext.info.places    = data.places;

        this.setSynonymsList();

        if(data && data['book'] && data['book']['parts'] && data['book']['parts'].forEach) data['book']['parts'].forEach(function(val){

            var chapters = [];

            if(val && val['chapters'] && val['chapters'].forEach) val['chapters'].forEach(function(chVal){
                chapters.push({
                    bookid: chVal.bookid,
                    cls: 'book-tree-add-button',
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
                expanded: true,
                text: val.label,
                type: val.type,
                note: val.note,
                children: chapters
            })
        });

        if(data && data['heroes'] && data['heroes'].forEach) data['heroes'].forEach(function(val){
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

        if(data && data['places'] && data['places'].forEach) data['places'].forEach(function(val){
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

        if(data && data['reminders'] && data['reminders'].forEach) data['reminders'].forEach(function(val){
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

    /* Из Ext.info создает массивы синонимов */
    setSynonymsList: function(){
        if(Ext.info.heroes && Ext.info.heroes.forEach) this.createSynonymsList(Ext.info.heroes);
        if(Ext.info.places && Ext.info.places.forEach) this.createSynonymsList(Ext.info.places);
    },

    createSynonymsList: function(data){
        var name = data[0].type,
            synonyms = [],
            synonymsoriginal = [];

        data.forEach(function(val){
            synonyms.push(val.label);
            synonymsoriginal.push(val.label);
            if(val && val.synonyms && typeof val.synonyms === 'string'){
                var list = val.synonyms.split('\n');
                synonyms = synonyms.concat(list);
                for(var i = 0; i < list.length; i++){
                    synonymsoriginal.push(val.label);
                }
            }
        });

        Ext.info[name + 'synonyms'] = synonyms;
        Ext.info[name + 'synonymsoriginal'] = synonymsoriginal;
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




    /* Событие клика по жлементу дерева */
    treeClick: function(self, records){

        if(!records || !records[0] || !records[0].getData) return;

        this.saveChapter();

       var record = records[0],
           data = record.getData(),
           id   = data.id,
           type = data.type,
           summaryPanel = this.getSummaryPanel();

        this.getTextPanel().down('htmleditor').hide();

        if(type === 'book'){
            this.clickOnBook(data, summaryPanel);
        }else if(type === 'part'){
            this.clickOnPart(data, summaryPanel);
        }else if(type === 'chapter'){
            this.clickOnChapter(data, summaryPanel);
        }else if(id === 'heroesroot'){
            this.clickOnHeroes(data, summaryPanel);
        }else if(type === 'heroes'){
            this.clickOnHero(data, summaryPanel);
        }else if(id === 'placesroot'){
            this.clickOnPlaces(data, summaryPanel);
        }else if(type === 'places'){
            this.clickOnPlace(data, summaryPanel);
        }else if(id === 'remindersroot'){
            this.clickOnReminders(data, summaryPanel);
        }else if(type === 'reminders'){
            this.clickOnReminder(data, summaryPanel);
        }

    },

    /* Сохраняет главу, если уходим с нее */
    saveChapter: function(){
        var chapterEditor = (this && this.getSummaryPanel && this.getSummaryPanel() && this.getSummaryPanel().down) ? this.getSummaryPanel().down('chapterEditor') : null,
            htmlEditor = (this && this.getTextPanel && this.getTextPanel() && this.getTextPanel().down) ? this.getTextPanel().down('htmleditor') : null;

        if(htmlEditor) htmlEditor.textValue = null;
        if(chapterEditor) chapterEditor.applyData(true);
    },


    /*------------------------*/
    /* КЛИКИ */

    clickOnBook: function(data, summaryPanel){
        summaryPanel.removeAll();
        var bookEditor = summaryPanel.add(Ext.create('APP.Summary.bookEditor')),
            func = function(data){
                bookEditor.displayData(data, true);
            };

        APP.utils.submitRequest('getbookdescription/' + data.bookid, {successfunc: func});
    },

    clickOnPart: function(data, summaryPanel){
        summaryPanel.removeAll();
        var partEditor = summaryPanel.add(Ext.create('APP.Summary.partEditor')),
            func = function(data){
                partEditor.displayData(data, true);
            };

        APP.utils.submitRequest('getpart/' + data.id, {successfunc: func});
    },

    clickOnChapter: function(data, summaryPanel){
        summaryPanel.removeAll();
        var chapterEditor = summaryPanel.add(Ext.create('APP.Summary.chapterEditor')),
            func = function(data){
                chapterEditor.displayData(data, true);
            };

        APP.utils.submitRequest('getchapter/' + data.id, {successfunc: func});
    },

    clickOnHeroes: function(data, summaryPanel){
        summaryPanel.removeAll();
        var heroEditor = summaryPanel.add(Ext.create('APP.Summary.heroEditor'));
        data.id = null;
        heroEditor.displayData(data);
    },

    clickOnHero: function(data, summaryPanel){
        summaryPanel.removeAll();
        var heroEditor = summaryPanel.add(Ext.create('APP.Summary.heroEditor')),
            func = function(data){
                heroEditor.displayData(data);
            };

        APP.utils.submitRequest('gethero/' + data.id, {successfunc: func});
    },

    clickOnPlaces: function(data, summaryPanel){
        summaryPanel.removeAll();
        var placeEditor = summaryPanel.add(Ext.create('APP.Summary.placeEditor'));
        data.id = null;
        placeEditor.displayData(data);
    },

    clickOnPlace: function(data, summaryPanel){
        summaryPanel.removeAll();
        var placeEditor = summaryPanel.add(Ext.create('APP.Summary.placeEditor')),
            func = function(data){
                placeEditor.displayData(data);
            };

        APP.utils.submitRequest('getplace/' + data.id, {successfunc: func});
    },

    clickOnReminders: function(data, summaryPanel){
        summaryPanel.removeAll();
        var reminderEditor = summaryPanel.add(Ext.create('APP.Summary.reminderEditor'));
        data.id = null;
        reminderEditor.displayData(data);
    },

    clickOnReminder: function(data, summaryPanel){
        summaryPanel.removeAll();
        var reminderEditor = summaryPanel.add(Ext.create('APP.Summary.reminderEditor')),
            func = function(data){
                reminderEditor.displayData(data);
            };

        APP.utils.submitRequest('getreminder/' + data.id, {successfunc: func});
    },

    /* КЛИКИ */
    /*------------------------*/

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