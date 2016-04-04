Ext.define('APP.TextPanel' , {
	extend: 'APP.GeneralPanel',
	alias: 'widget.TextPanel',

    title: ' ',
    name: 'TextPanel',
    layout: 'fit',

    items: [{
        xtype: 'htmleditor',
        hidden: true,
        enableColors: false,
        enableAlignments: false
    }]

});