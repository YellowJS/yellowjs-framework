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

    describe("constructor", function() {
        var el = null;
        beforeEach(function () {
            el = new oo.view.Element({"template":"test", "target" : "#elem-target"});
        });
        
        it("should be an instanceof oo.view.Dom", function () {
            expect(el instanceof oo.view.Dom).toBeTruthy();
        });

        it('_tpl must be equal to "test"', function() {
            expect(el._tpl).toEqual("test");
        });

        it('_target must have id "elem-target"', function(){
            var id = el.getId();
            expect(id).toEqual('elem-target');
        });
    });

    describe("methods", function(){
        var el = null;

        beforeEach(function () {
            el = new oo.view.Element({target: '#elem-target'});
        });

        describe("setTemplate", function() {
            it('_tpl must be equal to "test"', function() {
                el.setTemplate('test');
                expect(el._tpl).toEqual("test");
            });
        });

        describe("setModel", function() {
           it('_model must an instance of oo.data.Model', function() {
                el.setModel({id:'test', provider: 'fake'});
                expect(el._model instanceof oo.data.Model).toBeTruthy();
            });
        });

    });

    describe('render', function(){
        var provider = new oo.data.FakeProvider({
            "name" : "fdsfsdf"
        });

        var model = oo.createModel({
            'id' : "test",
            'provider' : provider
        });

        var list2 = new oo.view.Element({
            model : model,
            'template' : '<span clss="h1">{{firstname}}</span> | <span clss="h2">{{nickname}}</span><br />',
            'target' : '#elem-target'
        });

        model.fetch(function (data) {
            console.log(data);
        });
    });    

});
