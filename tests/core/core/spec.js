describe("oocore.js", function() {

    describe("scope binding", function () {

        var Obj = {ClsName: 'Cls'};

        var f = function () {
            return this.ClsName;
        };

        var f2 = oo.createDelegate(f, Obj);

        it('should return a function', function () {    
            expect(f2).toBeTruthy('function' == typeof f2);
        });

        it('should return the string \'Cls\'', function () {
            expect(f2()).toEqual('Cls');
        });

    });

    describe("override", function () {
        
        var baseObj = {
            'key1':'value1',
            'key2':'value2'
        };

        var overObj = {
            'key1':'new value1',
            'key3':'new value2'
        };

        var resultObj = oo.override(baseObj, overObj);

        it("should have \"new value1\" at \"key1\"", function () {
            expect(resultObj.key1).toEqual("new value1")
        });

        it("should have \"new value2\" at \"key3\"", function () {
            expect(resultObj.key3).toEqual("new value2")
        });

        it("should have \"value2\" at \"key2\"", function () {
            expect(resultObj.key2).toEqual("value2")
        });

    });

    describe("createElement list", function(){
        it('list must be an instance of oo.view.List', function(){
            var list = oo.createElement('list');
            expect(list instanceof oo.view.List).toBeTruthy();
        });
    });

});