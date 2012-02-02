(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var FakeProvider = ns.FakeProvider = my.Class(oo.data.Provider, {
        _data: [{
            'key' : 0,
            'firstname': 'claire',
            'nickname': 'Claire_So',
            'title' : 'article 1',
            'picture' : '1.jpg',
            'elementCls': 'elementA'
        }, {
            'key' : 2,
            'firstname': 'mathias',
            'nickname': 'FreakDev',
            'title' : 'article 2',
            'picture' : '2.jpg',
            'elementCls': 'elementA'
        },
        {
            'key' : 3,
            'firstname': 'ff',
            'nickname': 'FreakDev',
            'title' : 'article 3',
            'picture' : '3.jpg',
            'elementCls': 'elementA'
        },
        {
            'key' : 4,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 4',
            'picture' : '4.jpg',
            'elementCls': 'elementA'
        },
        {
            'key' : 5,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 5',
            'picture' : '3.jpg',
            'elementCls': 'elementA'
        },
        {
            'key' : 6,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 6',
            'picture' : '1.jpg',
            'elementCls': 'elementA'
        },
        {
            'key' : 7,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 7',
            'picture' : '3.jpg',
            'elementCls': 'elementA'
        },
        {
            'key' : 8,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 8',
            'picture' : '4.jpg',
            'elementCls': 'elementA'
        },
        {
            'key' : 9,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 9',
            'picture' : '1.jpg',
            'elementCls': 'elementA'
        },
        {
            'key' : 10,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 10',
            'picture' : '2.jpg',
            'elementCls': 'elementA'
        }
        ],
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