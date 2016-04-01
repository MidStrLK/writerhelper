Ext.define('APP.utils', {
	singleton: true,					        // Создается только 1 экземпляр объекта

    submitRequest: function(url, req){
        if(!url || typeof url !== 'string' || (req && typeof req !== 'object')) return;
        var method      = (req && req['method']      && typeof req['method']      === 'string')   ? req['method']      : 'GET',
            scope       = (req && req['scope']       && typeof req['scope']       === 'object')   ? req['scope']       : this,
            callback    = (req && req['callback']    && typeof req['callback']    === 'function') ? req['callback']    : function(opts, success, response) {
                   if(success){
                       successfunc.call(scope, JSON.parse(response.responseText))
                   }else{
                       errorfunc.call(scope, response);
                   }
                },
            successfunc = (req && req['successfunc'] && typeof req['successfunc'] === 'function') ? req['successfunc'] : function(a) {
                console.info(a);
            },
            errorfunc   = (req && req['errorfunc']   && typeof req['errorfunc']   === 'function') ? req['errorfunc']   : function(a){
                    console.info(url, a);
                },
            request     = {
                url:        url,
                method:     method,
                callback:   callback
            };

        if(req && req.data)  {
            request.jsonData = req.data;
            request.method   = 'POST';
        }
        if(req && req.scope) request.scope    = req.scope;

        Ext.Ajax.request(request)
    }
});