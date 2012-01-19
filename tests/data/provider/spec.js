describe("ooprovider.js", function() {

    describe("add a second provider with the same code name", function () {
        
        it("should throw an error", function () {
            expect(function () { oo.data.Provider.register(oo.data.FakeProvider, 'fake') }).toThrow('Already existing codename');
        });

    });

    describe("try to get a provider", function () {
        
        it("should return a provider", function () {
            var cls = oo.data.Provider.get('fake');
            var obj = new cls({name: 'oo'});
            expect(obj instanceof oo.data.Provider).toBeTruthy();
        });

        it("should throw an error", function () {
            expect(function () { oo.data.Provider.get('invalid-fake') }).toThrow('Invalid codename for a provider');
        });

    })    

    describe("provider instanciation without name", function () {
        it("should should have a name property", function () {
            expect (function () { var p = new oo.data.Provider(); }).toThrow('Config object must contain a name property');
        });
    });


    describe("call forbiden method on Provider \"interface\"", function () {

        var p = new oo.data.Provider({name: 'fakeProviderTest'});

        describe("call fetch method", function () {
        
            it("should throw an error", function () {
                expect(function () { p.fetch() }).toThrow('Can\'t be called directly from Provider class');
            });

        });

        describe("call save method", function () {
        
            it("should throw an error", function () {
                expect(function () { p.save(); }).toThrow('Can\'t be called directly from Provider class');
            });

        });

    });

});


describe("oofakeprovider.js", function() {

    var p = new oo.data.FakeProvider({
        'name': 'toto'
    });

    describe("instanciation", function () {

        it('should be called \'toto\'', function () {
            expect(p._name).toEqual('toto');
        });

    });

    describe("methods", function () {
            
        var clb;
        beforeEach(function () {
            clb = jasmine.createSpy();
        });

        describe ("fetch", function () {

            it("should call the callback with the data as parameter", function () {

                p.fetch(clb);

                expect(clb).wasCalledWith([{
                    'key1': 'value1',
                    'key2': 'value2'
                }]);
                
            });
                    
        });

        describe ("save", function () {

            it('should call the callback with the data as parameter', function () {

                var d = {key:'key3', value:'value3'};

                p.save(d, clb);

                expect(clb).wasCalled();
            });

        });

    });

});