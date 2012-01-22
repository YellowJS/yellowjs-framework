(function(oo){
    
    var Provider = oo.data.Provider;

    var Model = my.Class(null, oo.core.mixins.Events,{
        STATIC : {
            AFTER_SAVE : 'AFTER_SAVE',
            AFTER_FETCH : 'AFTER_FETCH'
        },
        constructor: function constructor(options){
            if(!options || (!options.hasOwnProperty('name') || !options.hasOwnProperty('provider')) )
                throw "Either property \"name\" or \"provider\" is missing in the options given to the Model constructor";
            this._name = options.name;

            this.setProvider(options.provider);
        },
        setProvider: function setProvider (providerConf) {
            if (providerConf instanceof Provider) {
                this._provider = providerConf;
            } else if (typeof providerConf == 'object') {
                var Cls = oo.data.Provider.get(providerConf.type);
                delete providerConf.type; providerConf.name = this._name;
                this._provider = new Cls(providerConf);
            }
        },
        fetch : function fetch(callback){
            var self = this,
                cb = function cb(datas){
                    if (datas){
                        if (callback){
                            callback(datas);
                        }
                        self.triggerEvent(Model.AFTER_FETCH, [datas]);
                    }
                };

            this._provider.fetch(cb);
        },
        save : function save(datas, callback){
            if(!datas || ( 'object' !== typeof datas )) {
                throw Error("Data parameter must exist and be an object");
            }

            this._provider.save(datas, callback);
            this.triggerEvent(Model.AFTER_SAVE);
        }
    });

    var exports = oo.getNS('oo.data');
    exports.Model = Model;
    
    return oo;

})(oo || {});