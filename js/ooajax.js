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
    Request = function Request (key, isPermanent, defaultParams) {
        
        /**
         * @var {String} url - the target url
         **/
        this.url;
        
        /**
         * @var {String} method - the http method used
         **/
        this.method;

        /**
         * @var {object} defaultParams - params that will be used if none are provided when calling send method
         **/
        this.defaultParams = {};

        /**
         * @var {Integer} key - the key reference into the ajaxPool
         **/
        this.key = key;
        
        /**
         * @var {Boolean} isPermanent - determine if the object is maintained after recieving the response
         **/
        this.isPermanent = isPermanent;
        
        /**
         * @var {XMLHttpRequest} xhr - the native xhr object
         **/
        this.xhr = new XMLHttpRequest();
        
        /**
         * @var {Boolean} isOpen - determine if a connection has already been opened (not sure it's very usefull)
         **/        
        this.isOpen = false;
        
        /**
         * @var {Boolean} isLoading - is the request is running or not
         **/        
        this.isLoading = false;
        var me = this;

        this.xhr.addEventListener('readystatechange', function () {
            if (4 == me.xhr.readyState) {
                me.isOpen = me.isLoading = false
                if (200 == me.xhr.status) {
                    me.successCallback(me.parseJson(me.xhr.responseText));
                } else {
                    me.errorCallback();
                }
                if (!isPermanent) {
                   me.destroy();
                }
            }

        });
    };
    
    var rp = Request.prototype;

    rp.parseJson = function (text) {
        dataWrapper = '(function () { return %json%; })()';
        var obj = eval(dataWrapper.replace('%json%', text));
        
        return obj;
    }
    
    rp.destroy = function () {
         delete ajaxPool[this.key];
    };    
    
    rp.setUrl = function (url) {
        this.url = url;
    };
    
    rp.setMethod = function (method) {
        this.method = method;
    }
    
    rp.setSuccessCallback = function (callback) {
        this.successCallback = callback;
    }
    
    rp.setErrorCallback = function (callback) {
        this.errorCallback = callback;
    }
    
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
        params = params || this.defaultParams;
        this.isLoading = true;
        
        this.xhr.send(params);
    };
    
    rp.abort = function () {
        this.xhr.abort();
    }

    // static class
    var Ajax = {
        // constant
        POST : 'POST',
        GET : 'GET',
        
        /**
         * build a request object stores its reference into the ajaxPool, and send data
         * use this method for one shot ajax call
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
            
            options.isPermanent = false;
            
            var key = this.buildRequest(options);
            
            var req = ajaxPool[key];
            
            req.send();
            
            return key;
        },
        
        /**
         * build a request object stores its reference into the ajaxPool
         *
         * @param {Object} options :
         *                 - url     -> url to request
         *                 - method  -> which HTTP method to use GET / POST
         *                 - params  -> params to embed in the request
         *                 - success -> the success callback
         *                 - error   -> the error callback         
         **/
        buildRequest: function (options) {
            if (undefined == options.url || null == options.url || "" == options.url) {
                throw new Error('no URL parameter given');
            }
            
            var method = options.method || this.GET;            
            var params = options.params || {};
            var isPermanent = options.isPermanent || false;
            var success = options.success || function () {};
            var error = options.error || function () {};
            var key = ajaxPool.getNextKey();
            
            var req = new Request(key, isPermanent, params);
            
            req.setUrl(options.url);            
            req.setMethod(method);
            req.setSuccessCallback(success);
            req.setErrorCallback(error);

            ajaxPool.insert(req);
            
            return key;
        },
        
        /**
         * returns the Request object associated with the given id;
         * use this method with caution - the ajax library is designed
         * to be a proxy for all ajax call, it is not recommended to use
         * a request object directly
         *
         * @param {Integer} id - the id of the request
         **/
        getRequest: function (id) {
            return ajaxPool[id];
        },
        
        getRequestStatus: function (id) {
            return ajaxPool[id].isLoading;
        },        
        
        /**
         * abort a previously send request by its key
         *
         * @param {Integer} id - the id of the request
         **/
        abortCall: function (id) {
            if (ajaxPool[id]) {
                ajaxPool[id].abort();
            }
        },

        destroy: function (id) {
            if (ajaxPool[id]) {
                ajaxPool[id].destroy();
            }
        },
        
        send: function (id, params) {
            if (ajaxPool[id]) {
                ajaxPool[id].send(params || {});
            }
        }
    };

    oo.Ajax = Ajax;
    return oo;

})(oo || {});