describe("ooprovider.js", function() {

    describe("add a second provider with the same code name", function () {
        
        it("should throw an error", function () {
            expect(function () { oo.data.Provider.register(oo.data.Fakeprovider, 'fake') }).toThrow('Already existing codename');
        });

    });

    describe("try to get a provider", function () {
        
        it("should return a provider", function () {
            var cls = oo.data.Provider.get('fake');
            var obj = new cls({name: 'oo'});
            expect(obj instanceof oo.data.Provider).toBeTruthy();
        });

        it("should throw an error", function () {
            expect(function () { oo.data.Provider.get('invalid-fake') }).toThrow('Invalid codename');
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

    var updByCallback = 1;
    var p = new oo.data.Fakeprovider({
        'name': 'toto'
    });

    describe("instanciation", function () {

        it('should be called \'toto\'', function () {
            expect(p._name).toEqual('toto');
        });

    });

    describe ("fetch", function () {

        p.fetch(function(data) {
            it('should return initial values', function () {
                expect(data.key1).toEqual('value1');
                expect(data.key2).toEqual('value2');
            });
        });
                
    });

    describe ("save", function () {

        p.save({key:'key3', value:'value3'}, function() {
            updByCallback = 2;

            it('should call the callback and update the value of updByCallback', function () {
                expect(updByCallback).toEqual(2);
            });
        });

        p.fetch(function(data) {
            it('should return saved value', function () {
                expect(data.key3).toEqual('value3');
            });
        });

    });

});