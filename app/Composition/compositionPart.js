Ext.define('APP.Composition.compositionPart' , {
	extend: 'Ext.panel.Panel',
	alias: 'widget.compositionPart',

    title: 'compositionPart',
    name: 'compositionPart',

    layout: 'accordion',
    items:[{
        text: 'основа',
        leaf: false,
        items: [
            {
                "text":"Отчеты",
                "leaf":false,
                "expanded":true,
                children: [
                    {
                        "text":"Отчеты",
                        "leaf":false,
                        "expanded":true
                    },{
                        "text":"Отчеты",
                        "leaf":false,
                        "expanded":true
                    },{
                        "text":"Отчеты",
                        "leaf":false,
                        "expanded":true
                    }
                ]
            }
        ]
    }]
});