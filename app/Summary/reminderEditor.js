Ext.define('APP.Summary.reminderEditor' , {
	extend: 'APP.Summary.extendEditor',
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
                            labelAlign: 'top',
                            listeners:{
                                change: function(field, text){
                                    var button = (this && this.up && this.up('panel') && this.up('panel').down) ? this.up('panel').down('[name="createHero"]') : null;
                                    console.info('text - ',button, text);
                                    if(button) button.setDisabled(!text);
                                }
                            }
                        },{
                            xtype: 'button',
                            name: 'saveHero',
                            text: 'Сохранить',
                            iconCls: 'icon-save',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('reminderEditor');
                                me.applyData();
                            }
                        },{
                            xtype: 'button',
                            name: 'removeHero',
                            text: 'Удалить',
                            iconCls: 'icon-remove',
                            cls: 'button-remove',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('reminderEditor');
                                me.getMessageBox();
                            }
                        },{
                            xtype: 'button',
                            name: 'createHero',
                            text: 'Создать',
                            iconCls: 'icon-plus',
                            disabled: true,
                            margin: '10 0 0 0',
                            hidden: true,
                            handler: function(btn, event){
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

        this.setTitles(data);
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
                //summaryPanel.removeAll();
                compositionPanel.getFullBook(data.bookid);
            }
        })
    }

});