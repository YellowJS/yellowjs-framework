describe("oomodel.js", function() {

    describe("instanciation", function () {

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

});