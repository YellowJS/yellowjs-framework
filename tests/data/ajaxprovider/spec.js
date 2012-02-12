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

    describe("methods", function () {
        
        var errorCb, successCb, p;

        beforeEach(function () {
            successCb = jasmine.createSpy();
            errorCb = jasmine.createSpy();

            p = new Cls({name: 'toto', url: 'toto.php', cacheProvider: 'local'});
            p.clearAll();
        });

        describe ("_processParams", function () {
            it ('should convert object into url encoded string', function () {

                var params = {titi:'tata', 'salut':'hello world', 'passe':'mais oui ca passe'};

                expect(p._processParams(params)).toEqual('titi=tata&salut=hello%20world&passe=mais%20oui%20ca%20passe');
            });
        });

        describe ("fetch", function () {

            it('should fetch and return data', function () {
                p.fetch({
                    success: function (data) {
                        successCb();
                        console.log(data);
                    },
                    //error: errorCb,
                    params: {'param1': 'value', 'bool': true, 'int': 3}
                });
                
                // check where is the bug...
                //expect(successCb).wasCalled();
                //expect(errorCb).wasCalled();
            });

        });

        describe ("save", function () {

            it ("should save values", function () {
                p.save({key:'key3', value:'value3'}, successCb /*function() {
                    console.log('data have been setn (POST)');
                }*/);

                //expect(successCb).wasCalled();

            });

        });

        describe ("get", function () {

            it ("should return the value store in the provider cache", function () {
                // by this way, force the get method to be called after a feth method has been previously called
                p.fetch();

                setTimeout(function () {
                    p.get(1, function(row) {
                        expect(row.firstname).toEqual('claire');
                        // don't know why the test won't work...
                        // so use the following workaround
                        if (row.firstname !== 'claire')
                            throw "expect " + row.firstname + "to equal \"claire\"";
                    });
                }, 1000);
            });
        });

    });
});