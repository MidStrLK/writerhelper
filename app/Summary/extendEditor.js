Ext.define('APP.Summary.extendEditor' , {
	extend: 'Ext.panel.Panel',
	alias: 'widget.extendEditor',

    name: 'extendEditor',

    setTitles: function(data){
        this.setSummaryTitle(data);

        this.setTextTitle(data);
    },

    setTextTitle: function(data){
        var summaryPanel = this.up('SummaryPanel'),
            textPanel = summaryPanel.getTextPanel(),
            label = '';

        if(data && data.type === 'chapter') label = data.label;

        textPanel.setTitle(label);
    },

    setSummaryTitle: function(data){
        var summaryTitle = {
                book: 'книгу',
                part: 'часть',
                chapter: 'главу',
                heroes: 'героя',
                places: 'место',
                reminders: 'напоминание'
            },
            sumTitle = (data && data.type && summaryTitle[data.type]) ? summaryTitle[data.type] : '',
            sumName = (data && data.label) ? ' "' + data.label + '"' : '',
            sumAction = (!sumName && data.text) ? 'Создаем ' : 'Редактируем ',
            summaryPanel = this.up('SummaryPanel');

        if(!sumTitle && data.id && data.id.indexOf('book') !== -1) sumTitle = summaryTitle['book'];

        sumTitle = sumAction + sumTitle + sumName;
        if(summaryPanel && sumTitle) summaryPanel.setTitle(sumTitle);
    },

    getMessageBox: function(){
        var me = this,
            id = this.id,
            title = 'ВНИМАНИЕ',
            text = 'Вы действительно хотите удалить ',
            name = id ? id.substr(0, id.indexOf('Editor')) : null,
            names = {
                book:       'книгу',
                part:       'часть',
                chapter:    'главу',
                hero:       'героя',
                place:      'место',
                reminder:   'напоминание'
            };

        if(name && names[name]) text = text + names[name] + '?';

        Ext.MessageBox.confirm(title, text, me.removeMessageBoxConfirm, me);
    },

    removeMessageBoxConfirm: function(btn){
        if(btn === 'yes') this.removeRequest();
    },

    removeRequest: function(){
        var me = this,
            thisId = this.id,
            name = thisId ? thisId.substr(0, thisId.indexOf('Editor')) : null;

        if(!name) return;

        var data = me.getChanges(),
            id = data.id,
            bookid = data.bookid,
            summaryPanel = me.up('SummaryPanel'),
            compositionPanel = summaryPanel.getCompositionPanel(),
            successfunc = function (respData) {
                summaryPanel.removeAll();
                if(bookid) compositionPanel.getBook(bookid);
            },
            requestText = 'remove' + name + '/' + id;

        if(!data.bookid && data.id.indexOf('book') !== -1){
            successfunc = function (respData) {
                summaryPanel.removeAll();
                compositionPanel.getBookList();
            }
        }

        APP.utils.submitRequest(requestText, {
            successfunc: successfunc
        });

    }



});