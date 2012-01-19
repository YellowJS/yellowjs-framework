describe("ooutils.js", function() {

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

    describe("createList", function(){
        it('list must be an instance of oo.view.List', function(){
            expect(list instanceof oo.view.List).toBeTruthy();
        });
    });

});