Ext.require([
    'APP.Composition.CompositionTree'
]);

Ext.define('APP.CompositionPanel' , {
	extend: 'APP.GeneralPanel',
	alias: 'widget.CompositionPanel',

    title: 'Книги',
    name: 'CompositionPanel',

    items: [{
        xtype: 'CompositionTree'
    }],

    afterRender: function(){
        this.callParent([].slice.call(arguments));

        this.getBookList();
    }

});