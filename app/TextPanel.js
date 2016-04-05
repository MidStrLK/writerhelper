Ext.define('APP.TextPanel' , {
	extend: 'APP.GeneralPanel',
	alias: 'widget.TextPanel',

    title: ' ',
    name: 'TextPanel',
    layout: 'fit',

    items: [{
        xtype: 'htmleditor',
        hidden: false,
        enableColors: true,
        enableAlignments: true,
        listeners: {
            sync: function(sender, html){

                if(!this.textValue) this.textValue = html;
                if(this.textValue === html) return;

                var chapterEditor = (this &&
                    this.up &&
                    this.up('panel') &&
                    this.up('panel').getSummaryPanel &&
                    this.up('panel').getSummaryPanel() &&
                    this.up('panel').getSummaryPanel().down) ? this.up('panel').getSummaryPanel().down('chapterEditor') : null;

                if(chapterEditor && chapterEditor.setUsed){
                    chapterEditor.setUsed(html, 'Heroes');
                    chapterEditor.setUsed(html, 'Places');
                }

                var length = html.length;

                if((this.textValue.indexOf(html) !== -1 || html.indexOf(this.textValue) !== -1) && Math.abs(this.textValue.length - length) > 10){
                    this.textValue = html;
                   chapterEditor.applyData(true);
                }

            }
        }
    }]

});