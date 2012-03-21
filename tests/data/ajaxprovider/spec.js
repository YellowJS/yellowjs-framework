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
        
        var p;

        beforeEach(function () {

            p = new Cls({name: 'toto', url: 'toto.php', cacheProvider: 'local'});
            p.clearAll();
        });

        describe ("fetch", function () {

            it('should fetch and return data', function () {
                runs(function () {

                    this.errorCb = jasmine.createSpy();
                    var successCb = this.successCb = jasmine.createSpy();

                    p.fetch({
                        success: function (data) {
                            successCb();
                            console.log(data);
                        },
                        //error: errorCb,
                        params: {'param1': 'value', 'bool': true, 'int': 3}
                    });
                });

                waits(1500);

                runs(function () {
                    expect(this.successCb).wasCalled();
                });
                
                // check where is the bug...
                //expect(errorCb).wasCalled();
            });

        });

        describe ("save", function () {

            var errorCb = jasmine.createSpy(), successCb = jasmine.createSpy();

            it ("should save values", function () {
                p.save({key:'key3', value:'value3'}, successCb /*function() {
                    console.log('data have been setn (POST)');
                }*/);

                //expect(successCb).wasCalled();

            });

        });

        describe ("get", function () {

            var errorCb = jasmine.createSpy(), successCb = jasmine.createSpy();

            it ("should return the value store in the provider cache", function () {
                // by this way, force the get method to be called after a fetch method has been previously called
                runs(function () {
                    p.fetch();
                });

                waits(1500);

                runs(function () {
                    p.get(1, function(row) {
                        expect(row.firstname).toEqual('claire');
                    });
                });
            });
        });

        describe ("fetch form cache", function () {

            it('should fetch and return data', function () {
                runs(function () {
                    p.fetch({
                        params: {'param1': 'value', 'bool': true, 'int': 3}
                    });
                });

                waits(1500);

                runs(function () {

                    this.errorCb = jasmine.createSpy();
                    var successCb = this.successCb = jasmine.createSpy();

                    p.fetch({
                        success: function (data) {
                            successCb();
                            console.log(data);
                        },
                        //error: errorCb,
                        params: {'param1': 'value', 'bool': true, 'int': 3}
                    });
                });

                waits(200);

                runs(function () {
                    expect(this.successCb).wasCalled();
                });
            });

        });

    });
});