Ext.define('APP.Summary.extendEditor' , {
	extend: 'Ext.panel.Panel',
	alias: 'widget.extendEditor',

    name: 'extendEditor',

    uniqueText: function(text1, text2){

        var threshold = 0.5;

        if( !text1 ||
            !text2 ||
            text1 === text2 ||
            text1.indexOf(text2) !== -1 ||
            text2.indexOf(text1) !== -1 ) return false;

        var text1Arr = text1.split(/\.|!/),
            text1Array = [],
            text2Arr = text2.split(/\.|!/),
            text2Array = [],
            count = 0,
            count1,count2;

        if(!text1Arr || !text1Arr.length || !text2Arr || !text2Arr.length) return false;

        text1Arr.forEach(function(val){
            if(val[0] === ' ') val = val.substr(1,val.length);
            if(val) text1Array.push(val);
        });
        text2Arr.forEach(function(val){
            if(val[0] === ' ') val = val.substr(1,val.length);
            if(val) text2Array.push(val);
        });

        count1 = text1Array.length;
        count2 = text2Array.length;

        text1Array.forEach(function(val1){
            text2Array.forEach(function(val2){
                if(val1 === val2 || val1.indexOf(val2) !== -1 || val2.indexOf(val1) !== -1) count++;
            })
        });

        if(!count) return true;

        count = (count/count1 + count/count2) / 2;    //(count1 + count2)/(2*count);

        return (count < threshold);

    },

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