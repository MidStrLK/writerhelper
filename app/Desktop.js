Ext.require([
	'APP.CompositionPanel',
	'APP.TextPanel',
	'APP.SummaryPanel'
]);

Ext.define('APP.Desktop' , {
	extend: 'Ext.container.Viewport',
	alias: 'widget.desktop',

	layout: 'border',
	items: [
        {
            xtype: 'CompositionPanel',
            region: 'west',
            width: 200,
            resizable: true,
            collapsible: true
        },
        {
            xtype: 'panel',
            region: 'center',
            layout: 'border',
            items: [
                {
                    xtype: 'SummaryPanel',
                    region: 'north',
                    height: 220,
                    resizable: true,
                    collapsible: true
                },{
                    xtype: 'TextPanel',
                    region: 'center'
                }
            ]
        }
	]
});