Ext.define('APP.TextPanel' , {
	extend: 'APP.GeneralPanel',
	alias: 'widget.TextPanel',

    title: 'TextPanel',
    name: 'TextPanel',
    layout: 'fit',

    items: [{
        xtype: 'htmleditor',
        enableColors: false,
        enableAlignments: false
    }]

});