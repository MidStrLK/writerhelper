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
                            iconCls: 'icon-edit',
                            text: 'Писать',
                            margin: '8 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('bookEditor');
                                me.getFullBook();
                            },
                            disabled: true
                        },{
                            xtype: 'button',
                            name: 'getText',
                            text: 'Получить текст',
                            iconCls: 'icon-text',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('bookEditor');
                                console.log('ВОТ ВАШ ТЕКСТ :(');
                            },
                            disabled: true
                        },{
                            xtype: 'button',
                            name: 'addPart',
                            text: 'Добавить часть',
                            iconCls: 'icon-plus',
                            disabled: true,
                            margin: '10 0 0 0',
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
                            iconCls: 'icon-save',
                            text: 'Сохранить',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('bookEditor');
                                me.applyData();
                            }
                        },{
                            xtype: 'container',
                            layout: 'hbox',
                            items:[
                                {
                                    xtype: 'button',
                                    name: 'closeBook',
                                    iconCls: 'icon-close',
                                    text: 'Закрыть',
                                    margin: '10 10 0 0',
                                    width: '50%',
                                    handler: function(btn, event){
                                        if(this && this.up && this.up('SummaryPanel')){
                                            this.up('SummaryPanel').getBookList();
                                        }
                                    },
                                    disabled: true
                                },{
                                    xtype: 'button',
                                    name: 'removeBook',
                                    text: 'Удалить',
                                    cls: 'button-remove',
                                    iconCls: 'icon-remove',
                                    margin: '10 0 0 0',
                                    width: '50%',
                                    handler: function(btn, event){
                                        var me = this.up('bookEditor');
                                        me.getMessageBox();
                                    },
                                    disabled: true
                                }
                            ]
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
        this.down('[name="symbols"]'    ).setValue(data.symbols   || 0);
        this.down('[name="note"]'       ).setValue(data.note        || '');
        this.down('[name="datebeg"]'    ).setValue(this.createDate(data.datebeg));
        this.down('[name="datechange"]'    ).setValue(this.createDate(data.datechange));

        var writeBook   = this.down('[name="writeBook"]'),
            //saveBook    = this.down('[name="saveBook"]'),
            addPart     = this.down('[name="addPart"]'),
            getText     = this.down('[name="getText"]'),
            removeBook  = this.down('[name="removeBook"]'),
            closeBook  = this.down('[name="closeBook"]');

        this.isOpen = isOpen;

        //writeBook.setVisible(!isOpen);
        //addPart.setVisible(isOpen);
        //getText.setVisible(!isOpen);
        //removeBook.setVisible(!isOpen);

        writeBook.setDisabled(isOpen);
        addPart.setDisabled(!isOpen);
        //getText.setDisabled(isOpen);
        removeBook.setDisabled(isOpen);
        closeBook.setDisabled(!isOpen);

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
    }

});