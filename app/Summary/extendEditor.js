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
    }



});