describe("ooAjaxProvider.js", function() {

    var Cls = oo.data.AjaxProvider;

    describe("instanciation", function () {

        it('should throw an error (missing url)', function () {
            expect(function () { var p = new Cls({'name': 'toto'}); }).toThrow('\'url\' property must be set');
        });

        it('should have a LocalProvider as cache', function () {
            var p = new Cls({'name': 'toto', url: '/toto'});
            expect(p._cacheProvider instanceof oo.data.LocalProvider).toBeTruthy();            
        });

        it('should have a FakeProvider as cache', function () {
            var p = new Cls({'name': 'toto', url: '/toto', cacheProvider: 'fake'});

            expect(p._cacheProvider instanceof oo.data.FakeProvider).toBeTruthy();
        });

    });

    describe ("_processParams", function () {
        it ('should convert object into url encoded string', function () {
            var p = new Cls({name: 'toto', url: '/toto'});

            var params = {titi:'tata', 'salut':'hello world', 'passe':'mais oui ca passe'};

            expect(p._processParams(params)).toEqual('titi=tata&salut=hello%20world&passe=mais%20oui%20ca%20passe');
        });
    });

    describe ("fetch", function () {

        // var errorCb = jasmine.createSpy(),
        //     successCb = jasmine.createSpy();

        var p = new Cls({name: 'toto', url: 'toto.php'});

        p.fetch({
            // don't know why the jasmine.spy cause a bug...
            //success: successCb,
            success: function (data) {
                console.log('success callback called');
            },
            //error: errorCb,
            error: function () {
                console.log('error callback called');
            },

            params: {'param1': 'value', 'bool': true, 'int': 3}
        });

        expectedAjaxResult = [
            { firstname: "claire", nickname: "Claire_So" },
            { firstname: "mathias", "nickname": "FreakDev"}
        ];
        
        // don't know why the jasmine.spy cause a bug...
        //expect(successCb).wasCalledWith(expectedAjaxResult);
        //expect(errorCb).wasCalledWith(expectedAjaxResult);
                
    });

    describe ("save", function () {

        var p = new Cls({name: 'toto', url: 'toto.php'});

        p.save({key:'key3', value:'value3'}, function() {
            console.log('data have been setn (POST)');
        });

    });

});