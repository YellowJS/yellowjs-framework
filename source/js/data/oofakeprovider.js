(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var FakeProvider = ns.FakeProvider = my.Class(oo.data.Provider, {
        _data: [{
            'key' : 0,
            'firstname': 'claire',
            'nickname': 'Claire_So',
            'title' : 'article 1',
            'elementCls': 'elementA'
        }, {
            'key' : 2,
            'firstname': 'mathias',
            'nickname': 'FreakDev',
            'title' : 'article 2',
            'elementCls': 'elementA'
        },
        {
            'key' : 3,
            'firstname': 'ff',
            'nickname': 'FreakDev',
            'title' : 'article 3',
            'elementCls': 'elementA'
        },
        {
            'key' : 4,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 4',
            'elementCls': 'elementA'
        }],
        constructor: function contructor (options) {
            FakeProvider.Super.call(this, options);
        },
        save: function save (data, callback) {
            if (!(data instanceof Array))
                data = [data];

            var self = this;
            data.forEach(function (val) {
                self._data.push(val);
            });
            
            if (callback) {
                callback.call(global);
            }
        },
        fetch: function fetch (callback) {
            callback.success.call(global, this._data);
        }
    });

    oo.data.Provider.register(FakeProvider, 'fake');

})(oo || {});