Ext.define('APP.Summary.bookEditor' , {
	extend: 'APP.Summary.extendEditor',
	alias: 'widget.bookEditor',

    name: 'bookEditor',

    layout: 'vbox',

    items: [
        {
            xtype: 'hidden',
            name: 'id'
        },{
            xtype: 'container',
            layout: 'hbox',
            width: '100%',
            defaults: {
                margin: 10
            },
            items:[
                {
                    xtype: 'container',
                    layout: 'vbox',
                    width: 230,
                    defaults: {
                        width: 230
                    },
                    items:[
                        {
                            xtype: 'textfield',
                            name: 'label',
                            fieldLabel: 'Название Книги',
                            labelAlign: 'top'
                        },{
                            xtype: 'button',
                            name: 'writeBook',
                            text: 'Писать',
                            margin: '42 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('bookEditor');
                                me.getFullBook();
                            }
                        },{
                            xtype: 'button',
                            name: 'getText',
                            text: 'Получить текст',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('bookEditor');
                                console.log('ВОТ ВАШ ТЕКСТ :(');
                            }
                        },{
                            xtype: 'button',
                            name: 'addPart',
                            text: 'Добавить часть',
                            margin: '10 0 0 0',
                            hidden: true,
                            handler: function(btn, event){
                                var me = this.up('bookEditor');
                                me.addPart();
                            }
                        }
                    ]
                },{
                    xtype: 'container',
                    layout: 'vbox',
                    width: 230,
                    defaults: {
                        width: 230
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'datebeg',
                            fieldLabel: 'Создана',
                            readOnly: true
                        },{
                            xtype: 'textfield',
                            name: 'datechange',
                            fieldLabel: 'Изменена',
                            readOnly: true
                        },{
                            xtype: 'textfield',
                            name: 'symbols',
                            fieldLabel: 'Символов',
                            readOnly: true
                        },{
                            xtype: 'button',
                            name: 'saveBook',
                            text: 'Сохранить книгу',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('bookEditor');
                                me.applyData();
                            }
                        },{
                            xtype: 'button',
                            name: 'removeBook',
                            text: 'Удалить книгу',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('bookEditor');
                                me.removeBook();
                            }
                        }
                    ]
                },{
                    xtype: 'container',
                    layout: 'vbox',
                    width: 160,
                    defaults: {
                        width: 160
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'part',
                            fieldLabel: 'Частей',
                            readOnly: true
                        },{
                            xtype: 'textfield',
                            name: 'chapter',
                            fieldLabel: 'Глав',
                            readOnly: true
                        },{
                            xtype: 'textfield',
                            name: 'heroes',
                            fieldLabel: 'Героев',
                            readOnly: true
                        },{
                            xtype: 'textfield',
                            name: 'places',
                            fieldLabel: 'Мест',
                            readOnly: true
                        },{
                            xtype: 'textfield',
                            name: 'reminders',
                            fieldLabel: 'Напоминаний',
                            readOnly: true
                        }
                    ]
                },{
                    xtype: 'textarea',
                    name: 'note',
                    fieldLabel: 'Описание',
                    labelAlign: 'top',
                    margin: '0 10 10 10',
                    height: '100%',
                    flex: 1
                }
            ]
        },{
            xtype: 'container',
            layout: 'vbox',
            items:[

            ]
        }
    ],

    getFullBook: function(){
        var me = this,
            panel = me.up('SummaryPanel'),
            successfunc = panel.showFullBook,
            data = me.getChanges(),
            id = data.id;

        APP.utils.submitRequest('getbook/' + id, {successfunc: successfunc, scope: panel});
    },

    displayData: function(data, isOpen){
        this.down('[name="id"]'         ).setValue(data.id);
        this.down('[name="label"]'      ).setValue(data.label       || '');
        this.down('[name="part"]'       ).setValue(data.part        || 0);
        this.down('[name="chapter"]'    ).setValue(data.chapter     || 0);
        this.down('[name="heroes"]'     ).setValue(data.heroes      || 0);
        this.down('[name="places"]'     ).setValue(data.places      || 0);
        this.down('[name="reminders"]'  ).setValue(data.reminders   || 0);
        this.down('[name="note"]'       ).setValue(data.note        || '');
        this.down('[name="datebeg"]'    ).setValue(this.createDate(data.datebeg));

        var writeBook   = this.down('[name="writeBook"]'),
            //saveBook    = this.down('[name="saveBook"]'),
            addPart     = this.down('[name="addPart"]'),
            getText     = this.down('[name="getText"]'),
            removeBook  = this.down('[name="removeBook"]');

        this.isOpen = isOpen;

        writeBook.setVisible(!isOpen);
        //saveBook.setVisible(!isOpen);
        addPart.setVisible(isOpen);
        getText.setVisible(!isOpen);
        removeBook.setVisible(!isOpen);

        this.setTitles(data);
    },

    createDate: function(timestamp) {
        if(!timestamp) return '';

        var date = new Date(timestamp);
        return Ext.Date.format(date, 'd.m.Y H:i')
    },

    getChanges: function(){
        return {
            id:     this.down('[name="id"]').getValue(),
            label:  this.down('[name="label"]').getValue(),
            note:   this.down('[name="note"]').getValue()
        }
    },

    applyData: function(){
        console.log('this - ',this);
        var me = this,
            isOpen = me.isOpen,
            data = me.getChanges(),
            summaryPanel = me.up('SummaryPanel'),
            compositionPanel = summaryPanel.getCompositionPanel();

        APP.utils.submitRequest('postbook',{
            data: data,
            successfunc: function(respData){
                //summaryPanel.removeAll();
                if(!isOpen) compositionPanel.getBookList();
                if(isOpen) compositionPanel.getFullBook(data.bookid);

            }
        })
    },

    addPart: function(){
        var me = this,
            data = me.getChanges(),
            summaryPanel = me.up('SummaryPanel'),
            compositionPanel = summaryPanel.getCompositionPanel();
        APP.utils.submitRequest('postpart/' + data.id, {
            successfunc: function (respData) {
                summaryPanel.removeAll();
                compositionPanel.getFullBook(data.id);
            }
        });
    },

    removeBook: function(){
        var me = this,
            data = me.getChanges(),
            summaryPanel = me.up('SummaryPanel'),
            compositionPanel = summaryPanel.getCompositionPanel();
        APP.utils.submitRequest('removebook/' + data.id, {
            successfunc: function (respData) {
                summaryPanel.removeAll();
                compositionPanel.getBookList();
            }
        });
    }

});