Ext.require([
    'APP.Composition.compositionPart'
]);

Ext.define('APP.Composition.CompositionTree' , {
	extend: 'Ext.tree.Panel',
	alias: 'widget.CompositionTree',

    //title: 'CompositionTree',
    name: 'CompositionTree',

    rootVisible: false,

    afterRender: function(){
        this.callParent([].slice.call(arguments));

        var me = this.up('CompositionPanel');
        this.on('selectionchange', me.treeClick, me);
        //this.on('itemclick', me.treeClick, me);
    }
});