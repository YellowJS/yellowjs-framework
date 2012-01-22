describe("ooelement.js", function() {

    describe("add a second list with the same code name", function () {
        
        it("should throw an error", function () {
            expect(function () {
                oo.view.Element.register(oo.view.List, 'list'); }).toThrow('Already existing codename');
        });

    });

    describe("try to get an element", function () {
        
        it("should return a list", function () {
            var cls = oo.view.Element.get('list');
            var obj = new cls({name: 'oo', target: '#elem-target'});
            expect(obj instanceof oo.view.List).toBeTruthy();
        });

        it("should throw an error", function () {
            expect(function () { oo.view.Element.get('error-name'); }).toThrow('Invalid codename');
        });

    });

    describe("element instanciation without name", function () {
        it("should have a name property", function () {
            expect (function () { var p = new oo.view.Element(); }).toThrow('call Element constructor but "options" missing');
        });
    });

    describe("unregistrer list", function () {
        it("should throw an error", function () {
            oo.view.Element.unregister('list');
            expect(function () { oo.view.Element.get('list'); }).toThrow('Invalid codename');
        });
    });

});
