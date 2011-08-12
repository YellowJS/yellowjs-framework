var oo = (function (oo) {

    /**
     * @var {Array} ajaxPool - internal request pool - used to keep reference to running request 
     **/
    var ajaxPool = [];

    /**
     * insert an element into the pool and reference it with an auto incremented key
     * @param {Mixed} elem - element to insert into the pool
     * @return {Int}
     **/
    ajaxPool.insert = function insert(elem) {
        if (undefined == this.autoIncrementKey) {
            this.autoIncrementKey = 0;
        }

        this.autoIncrementKey++;
        ajaxPool[this.autoIncrementKey] = elem;
        
        return this.autoIncrementKey;
    }

    /**
     * return key that will be used on next insertion
     **/
    ajaxPool.getNextKey = function getNextKey () {
        if (undefined == this.autoIncrementKey) {
            this.autoIncrementKey = 0;
        }

        return this.autoIncrementKey + 1;
    }

    /**
     * the Request class is a wrapper for native XMLHttpRequest object
     * it provide the same interface but osme shortcut are implemented 
     * (no need to open connection before send data, it will be done for you)
     *
     * @constructor
     **/
    Request = function Request (key, url, method) {
        
        this.key = key;
        this.url = url;
        this.method = method;
        this.xhr = new XMLHttpRequest();
        
        this.isOpen = false;
        this.isLoading = false;
        var me = this;

        this.xhr.addEventListener('readystatechange', function () {
            if (4 == me.xhr.readyState) {
                me.isOpen = me.isLoading = false
                if (200 == me.xhr.status) {
                    ajaxPool[me.key]['success'](me.xhr.responseText);
                } else {
                    ajaxPool[me.key]['error']();
                }
            }

        });
    };
    
    var rp = Request.prototype;
    
    rp.open = function () {
        // force asynchrone
        try {
            this.xhr.open(this.method, this.url, true);
            this.isOpen = true;
        } catch (e) {
            throw e;
        }
        
        
    };
    
    rp.send = function (params) {
        if (!this.isOpen) {
            this.open();
        }    
        params = params || {};
        this.isLoading = true;
        
        this.xhr.send(params);
    };
    
    rp.abort = function () {
        this.xhr.abort();
    }

    var ajax = {
        POST : 'POST',
        GET : 'GET',
        
        /**
         * build a request object stores its reference into the ajaxPool, and send data
         * @param {Object} options :
         *                 - url     -> url to request
         *                 - method  -> which HTTP method to use GET / POST
         *                 - params  -> params to embed in the request
         *                 - success -> the success callback
         *                 - error   -> the error callback
         **/
        ajaxCall: function (options) {
            if (undefined == options.url || null == options.url || "" == options.url) {
                throw new Error('no URL parameter given');
            }
                
            var method = options.method || this.GET;
            var params = options.params || {};
            var success = options.success || function () {};
            var error = options.error || function () {};            
            var key = ajaxPool.getNextKey();
            
            var req = new Request(key, options.url, method, params);
            
            ajaxPool.insert({req:req, success:success, error:error});
            
            req.send(params);
            
            return key;
        },
        
        abortCall: function (key) {
            
            if (ajaxPool[key]) {
                ajaxPool[key].req.abort();
            }
            
        }
    };

    oo.ajax = ajax;
    return oo;

})(oo || {});