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
        }
    });

    var exports = oo.getNS('oo.data');
    exports.Model = Model;
    
    return oo;

})(oo || {});