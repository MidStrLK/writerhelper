Ext.require('APP.utils');

Ext.application({

	name: 'APP',

	launch: function(){
		Ext.create('APP.Desktop');

	}
});