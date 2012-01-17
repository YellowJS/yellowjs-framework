describe("ooprovider.js", function() {

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