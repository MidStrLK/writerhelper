Ext.define('APP.Summary.reminderEditor' , {
	extend: 'Ext.panel.Panel',
	alias: 'widget.reminderEditor',

    name: 'reminderEditor',

    layout: 'vbox',

    items: [
        {
            xtype: 'hidden',
            name: 'id'
        },{
            xtype: 'hidden',
            name: 'bookid'
        },{
            xtype: 'hidden',
            name: 'inkId'
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
                            fieldLabel: 'Название',
                            labelAlign: 'top'
                        },{
                            xtype: 'button',
                            name: 'saveHero',
                            text: 'Сохранить',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('reminderEditor');
                                me.applyData();
                            }
                        },{
                            xtype: 'button',
                            name: 'removeHero',
                            text: 'Удалить',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('reminderEditor');
                                me.removeReminder();
                            }
                        },{
                            xtype: 'button',
                            name: 'createHero',
                            text: 'Создать',
                            margin: '10 0 0 0',
                            hidden: true,
                            handler: function(btn, event){
                                console.log('this - ',this);
                                var me = this.up('reminderEditor');
                                me.applyData();
                            }
                        }
                    ]
                },{
                    xtype: 'textarea',
                    name: 'synonyms',
                    fieldLabel: 'Событие',
                    labelAlign: 'top',
                    margin: '0 10 10 10',
                    height: '100%',
                    flex: 1
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

    displayData: function(data){

        var saveHero   = this.down('[name="saveHero"]'),
            removeHero = this.down('[name="removeHero"]'),
            createHero = this.down('[name="createHero"]');

        saveHero.setVisible(data && data.id);
        removeHero.setVisible(data && data.id);
        createHero.setVisible(!data || !data.id);

        this.down('[name="id"]'         ).setValue(data.id);
        this.down('[name="bookid"]'     ).setValue(data.bookid);
        this.down('[name="inkId"]'      ).setValue(data.inkId);
        this.down('[name="label"]'      ).setValue(data.label       || '');
        this.down('[name="note"]'       ).setValue(data.note        || '');
        this.down('[name="synonyms"]'   ).setValue(data.synonyms    || '');
    },

    getChanges: function(){
        var res = {
            id:         this.down('[name="id"]').getValue(),
            bookid:     this.down('[name="bookid"]').getValue(),
            inkId:      this.down('[name="inkId"]').getValue(),
            label:      this.down('[name="label"]').getValue(),
            note:       this.down('[name="note"]').getValue(),
            synonyms:   this.down('[name="synonyms"]').getValue()
        };

        return res;
    },

    applyData: function(){
        var me = this,
            data = me.getChanges(),
            summaryPanel = me.up('SummaryPanel'),
            compositionPanel = summaryPanel.getCompositionPanel();

        APP.utils.submitRequest('postreminder',{
            data: data,
            successfunc: function(respData){
                summaryPanel.removeAll();
                compositionPanel.getFullBook(data.bookid);
            }
        })
    },

    removeReminder: function(){
        var me = this,
            data = me.getChanges(),
            summaryPanel = me.up('SummaryPanel'),
            compositionPanel = summaryPanel.getCompositionPanel();
        APP.utils.submitRequest('removereminder/' + data.id, {
            successfunc: function (respData) {
                summaryPanel.removeAll();
                compositionPanel.getBookList();
            }
        });
    }

});