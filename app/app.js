Ext.application({

	name: 'APP',

	launch: function(){

		Ext.create('APP.Desktop');

        Ext.override(Ext.MessageBox, {		// Переписываем текст на стандартных кнопках
            buttonText: { yes: "Да", no: "Нет", cancel: "Отмена" }
        });

	}
});