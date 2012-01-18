(function(oo){
    
    var Provider = oo.data.Provider;



    var Model = my.Class(null, oo.core.mixins.Events,{
        constructor: function constructor(options){
            if(!options || (!options.hasOwnProperty('id') || !options.hasOwnProperty('provider')) ) return;
            this._id = options.id;
            this._provider = options.provider;
        },
        fetch : function fetch(callback){
            this._provider.fetch(callback);
        },
        save : function save(datas, callback){
            if(!datas || ( 'object' !== typeof datas )) {
                throw Error("Data parameter must exist and be an object");
            }

            this._provider.save(datas, callback);
        }
    });

    var exports = oo.getNS('oo.data');
    exports.Model = Model;
    
    return oo;

})(oo || {});