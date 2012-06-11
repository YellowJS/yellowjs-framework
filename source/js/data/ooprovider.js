(function (oo) {
    
    var global = this;
    var data = oo.getNS('oo.data');

    var providerRepository = {};

    data.Provider = oo.Class({
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
                    throw 'Invalid codename for a provider';
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
        save: function (data, callback) {
            throw 'Can\'t be called directly from Provider class';
        },
        fetch: function (callback) {
            throw 'Can\'t be called directly from Provider class';
        },
        get: function (callback) {
            throw 'Can\'t be called directly from Provider class';
        },
        clearAll: function (callback) {
            throw 'Can\'t be called directly from Provider class';
        },
        remove: function (data, callback) {
            throw 'Can\'t be called directly from Provider class';
        }
    });

})(yellowjs || {});