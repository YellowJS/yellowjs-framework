describe("ooajax.js", function() {

    describe ("_processParams", function () {
        it ('should convert object into url encoded string', function () {

            var params = {titi:'tata', 'salut':'hello world', 'passe':'mais oui ca passe'};
            
            var req = new oo.core.net.Ajax();
            
            expect(req._processParams(params)).toEqual('titi=tata&salut=hello%20world&passe=mais%20oui%20ca%20passe');
        });
    });

    describe("check helper", function () {

        it ("should return a function", function () {
            expect(typeof oo.ajax().post === 'function').toBeTruthy();
            expect(typeof oo.ajax().get === 'function').toBeTruthy();
        });

        it ("should call the success callback", function () {

            var success = jasmine.createSpy();

            runs(function () {
                oo.ajax().post('ajax-json.json', {}, success, oo.emptyFn);
            });

            waits(500);

            runs(function () {
                expect(success).wasCalled();
            });
        });

        it ("should call the error callback", function () {

            var error = jasmine.createSpy();

            runs(function () {
                oo.ajax().post('ajax-json.jsn', {}, oo.emptyFn, error);
            });

            waits(500);

            runs(function () {
                expect(error).wasCalled();
            });
        });

    });



});