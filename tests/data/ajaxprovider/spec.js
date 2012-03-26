describe("ooAjaxProvider.js", function() {

    var Cls = oo.data.AjaxProvider;

    describe("instanciation", function () {

        it('should throw an error (missing url)', function () {
            expect(function () { var p = new Cls({'name': 'toto'}); }).toThrow('\'url\' property must be set');
        });

        it('should have a MemoryProvider as cache', function () {
            var p = new Cls({'name': 'toto', url: '/toto'});
            expect(p._cacheProvider instanceof oo.data.MemoryProvider).toBeTruthy();
        });

        it('should have a FakeProvider as cache', function () {
            var p = new Cls({'name': 'toto', url: '/toto', cacheProvider: 'fake'});

            expect(p._cacheProvider instanceof oo.data.FakeProvider).toBeTruthy();
        });

    });

    describe("methods", function () {
        
        var p;

        beforeEach(function () {

            p = new Cls({name: 'toto', url: 'toto.php', cacheProvider: 'memory'});
            p.clearAll();
        });

        describe ("fetch", function () {

            it('should fetch and return data', function () {
                runs(function () {

                    this.errorCb = jasmine.createSpy();
                    this.successCb = jasmine.createSpy();

                    p.fetch({
                        success: this.successCb,
                        error: this.errorCb,
                        params: {'param1': 'value', 'bool': true, 'int': 3}
                    });
                });

                waits(1500);

                runs(function () {
                    expect(this.successCb).wasCalled();
                });
                
            });

        });

        describe ("save", function () {

            var errorCb = jasmine.createSpy(), successCb = jasmine.createSpy();

            it ("should save values", function () {
                runs(function () {
                    p.save({key:'key3', value:'value3'}, successCb);
                });
                
                waits(500);

                runs(function () {
                    expect(successCb).wasCalled();
                });

            });

        });

        describe ("get", function () {

            var errorCb = jasmine.createSpy(), successCb = jasmine.createSpy();

            it ("should return the value stored in the provider cache", function () {
                runs(function () {
                    // by this way, force the get method to be called after a fetch method has been previously called
                    p.fetch();
                });

                waits(1500);

                runs(function () {
                    p.get(null, function(data) {
                        expect(data[0].firstname).toEqual('claire');
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
                    this.successCb = jasmine.createSpy();

                    p.fetch({
                        success: this.successCb,
                        error: this.errorCb,
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