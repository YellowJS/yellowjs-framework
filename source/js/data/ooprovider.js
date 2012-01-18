(function (oo) {
    
    var global = this;
    var data = oo.getNS('oo.data');

    var providerRepository = {};

    data.Provider = my.Class({
        STATIC: {
            register: function register (cls, codename) {
                if (providerRepository[codename])
                    throw 'Already existing codename';

                providerRepository[codename] = cls;
            },
            get: function get (codename) {
                if (codename in providerRepository)
                    return providerRepository[codename];
                else
                    throw 'Invalid codename';
            },
            unregister: function register (codename) {
                delete providerRepository[codename];
            }
        },
        _name: '',
        _data: {},
        constructor: function (options) {
            if (options && 'name' in options && typeof options.name == 'string')
                this._name = options.name;
            else
                throw 'Config object must contain a name property';
        },
        save: function (callback) {
            throw 'Can\'t be called directly from Provider class';
        },
        fetch: function (callback) {
            throw 'Can\'t be called directly from Provider class';
        }
    });

})(oo || {});