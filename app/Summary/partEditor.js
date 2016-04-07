Ext.define('APP.Summary.partEditor' , {
	extend: 'APP.Summary.extendEditor',
	alias: 'widget.partEditor',

    name: 'partEditor',

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
                            fieldLabel: 'Название Части',
                            labelAlign: 'top'
                        },{
                            xtype: 'button',
                            name: 'saveHero',
                            text: 'Сохранить',
                            iconCls: 'icon-save',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('partEditor');
                                me.applyData();
                            }
                        },{
                            xtype: 'button',
                            name: 'removeHero',
                            text: 'Удалить',
                            cls: 'button-remove',
                            iconCls: 'icon-remove',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('partEditor');
                                me.getMessageBox();
                            }
                        },{
                            xtype: 'button',
                            name: 'addChapter',
                            text: 'Создать Главу',
                            iconCls: 'icon-plus',
                            margin: '10 0 0 0',
                            hidden: true,
                            handler: function(btn, event){
                                var me = this.up('partEditor');
                                me.addChapter();
                            }
                        },{
                            xtype: 'button',
                            name: 'createHero',
                            iconCls: 'icon-plus',
                            text: 'Создать',
                            margin: '10 0 0 0',
                            hidden: true,
                            handler: function(btn, event){
                                var me = this.up('partEditor');
                                me.applyData();
                            }
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

    displayData: function(data){

        var saveHero   = this.down('[name="saveHero"]'),
            removeHero = this.down('[name="removeHero"]'),
            addChapter = this.down('[name="addChapter"]'),
            createHero = this.down('[name="createHero"]');

        saveHero.setVisible(data && data.id);
        removeHero.setVisible(data && data.id);
        addChapter.setVisible(data && data.id);
        createHero.setVisible(!data || !data.id);

        this.down('[name="id"]'         ).setValue(data.id);
        this.down('[name="bookid"]'     ).setValue(data.bookid);
        this.down('[name="inkId"]'      ).setValue(data.inkId);
        this.down('[name="label"]'      ).setValue(data.label       || '');
        this.down('[name="note"]'       ).setValue(data.note        || '');

        this.setTitles(data);

    },

    getChanges: function(){
        var res = {
            id:         this.down('[name="id"]').getValue(),
            bookid:     this.down('[name="bookid"]').getValue(),
            inkId:      this.down('[name="inkId"]').getValue(),
            label:      this.down('[name="label"]').getValue(),
            note:       this.down('[name="note"]').getValue()
        };

        return res;
    },

    addChapter: function(){
        var me = this,
            data = me.getChanges(),
            summaryPanel = me.up('SummaryPanel'),
            compositionPanel = summaryPanel.getCompositionPanel();
        APP.utils.submitRequest('postchapter/' + data.id, {
            data: data,
            successfunc: function (respData) {
                summaryPanel.removeAll();
                compositionPanel.getFullBook(data.bookid);
            }
        });
    },

    applyData: function(){
        var me = this,
            data = me.getChanges(),
            summaryPanel = me.up('SummaryPanel'),
            compositionPanel = summaryPanel.getCompositionPanel();

        APP.utils.submitRequest('postpart',{
            data: data,
            successfunc: function(respData){
                //summaryPanel.removeAll();
                compositionPanel.getFullBook(data.bookid);
            }
        })
    }

});