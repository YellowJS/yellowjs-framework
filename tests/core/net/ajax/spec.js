describe("oocore.js", function() {

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

            oo.ajax().post('ajax-json.json', {}, function () {
                console.log('success ajax');
                success();
            }, oo.emptyFn);
            expect(success).wasCalled();
        });

        it ("should call the error callback", function () {

            var error = jasmine.createSpy();

            oo.ajax().post('ajax-json.jsn', {}, oo.emptyFn, function () {
                console.log('error ajax');
                error();
            });
            expect(error).wasCalled();
        });

    });



});