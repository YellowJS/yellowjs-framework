(function(oo){
    
    var Provider = oo.data.Provider;

    var Model = my.Class(null, oo.core.mixins.Events,{
        STATIC : {
            AFTER_SAVE : 'AFTER_SAVE',
            AFTER_FETCH : 'AFTER_FETCH'
        },
        constructor: function constructor(options){
            if(!options || (!options.hasOwnProperty('id') || !options.hasOwnProperty('provider')) ) return;
            this._id = options.id;
            this._provider = options.provider;
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