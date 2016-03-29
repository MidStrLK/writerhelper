Ext.require([
    'APP.Composition.compositionPart'
]);

Ext.define('APP.Composition.CompositionTree' , {
	extend: 'Ext.tree.Panel',
	alias: 'widget.CompositionTree',

    //title: 'CompositionTree',
    name: 'CompositionTree',

    rootVisible: false,

    initComponent: function(){
        this.callParent([].slice.call(arguments));

        var me = this.up('CompositionPanel');
        this.on('itemclick', me.treeClick, me);
    }
});