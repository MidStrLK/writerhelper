Ext.define('APP.Summary.chapterEditor' , {
	extend: 'APP.Summary.extendEditor',
	alias: 'widget.chapterEditor',

    name: 'chapterEditor',

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
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('chapterEditor');
                                me.applyData();
                            }
                        },{
                            xtype: 'button',
                            name: 'removeHero',
                            text: 'Удалить',
                            margin: '10 0 0 0',
                            handler: function(btn, event){
                                var me = this.up('chapterEditor');
                                me.removeHero();
                            }
                        },{
                            xtype: 'button',
                            name: 'createHero',
                            text: 'Создать',
                            margin: '10 0 0 0',
                            hidden: true,
                            handler: function(btn, event){
                                var me = this.up('chapterEditor');
                                me.applyData();
                            }
                        }
                    ]
                },{
                    xtype: 'textarea',
                    name: 'usedHeroes',
                    fieldLabel: 'Герои',
                    labelAlign: 'top',
                    margin: '0 10 10 10',
                    height: '100%',
                    flex: 1
                },{
                    xtype: 'textarea',
                    name: 'usedPlaces',
                    fieldLabel: 'Места',
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
                    flex: 2
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

        var textPanel = this.up('SummaryPanel').getTextPanel(),
            htmlEditor = textPanel.down('htmleditor');

        htmlEditor.show();
        htmlEditor.setValue(data.text);

        this.setUsed(data.text, 'Heroes');
        this.setUsed(data.text, 'Places');

        this.setTitles(data);

    },

    setUsed: function(text, name){
        if(!text || !name) return;
        var usedTextarea = this.down('[name="used' + name + '"]'),
            textArr = text.split(' '),
            usedArr = [];

        if( textArr &&
            textArr.forEach &&
            Ext.info &&
            Ext.info[name.toLowerCase() + 'synonyms'] &&
            Ext.info[name.toLowerCase() + 'synonyms'].forEach &&
            Ext.info[name.toLowerCase() + 'synonymsoriginal']){
                textArr.forEach(function(valText){
                    Ext.info[name.toLowerCase() + 'synonyms'].forEach(function(valSyn, keySyn){
                        if(valText.toLowerCase().indexOf(valSyn.toLowerCase()) === 0){
                            var inUse = false,
                                inUseName = Ext.info[name.toLowerCase() + 'synonymsoriginal'][keySyn];
                            usedArr.forEach(function(valUsed){
                                if(valUsed === inUseName) inUse = true;
                            });
                            if(!inUse) usedArr.push(inUseName);
                            //usedTextarea.setValue(usedTextarea.getValue() + Ext.info[name.toLowerCase() + 'synonymsoriginal'][keySyn] + '\n')
                        }
                    })
                });

            usedTextarea.setValue(usedArr.join('\n'));
        }
    },

    getChanges: function(){
        return {
            id:         this.down('[name="id"]').getValue(),
            bookid:     this.down('[name="bookid"]').getValue(),
            inkId:      this.down('[name="inkId"]').getValue(),
            label:      this.down('[name="label"]').getValue(),
            note:       this.down('[name="note"]').getValue(),
            text:       this.up('SummaryPanel').getTextPanel().down('htmleditor').getValue()
        };
    },

    applyData: function(){
        var me = this,
            data = me.getChanges(),
            summaryPanel = me.up('SummaryPanel'),
            compositionPanel = summaryPanel.getCompositionPanel();

        APP.utils.submitRequest('postchapter',{
            data: data,
            successfunc: function(respData){
                //summaryPanel.removeAll();
                compositionPanel.getFullBook(data.bookid);
            }
        })
    },

    removeHero: function(){
        var me = this,
            data = me.getChanges(),
            summaryPanel = me.up('SummaryPanel'),
            compositionPanel = summaryPanel.getCompositionPanel();
        APP.utils.submitRequest('removechapter/' + data.id, {
            successfunc: function (respData) {
                summaryPanel.removeAll();
                compositionPanel.getBookList();
            }
        });
    }

});