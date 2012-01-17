(function (oo) {
    
    var global = this;
    var data = oo.getNS('oo.data');

     data.Provider = my.Class({
        _name: '',
        _data: {
            'data': 'titi',
            'toto': 'tutu'
        },
        constructor: function (options) {
            this._name = options.name;
        },
        save: function (callback) {
            throw Error('can\'t be called directly from Provider class');
        },
        fetch: function (callback) {
            throw Error('can\'t be called directly from Provider class');
        }
     });

})(oo || {});