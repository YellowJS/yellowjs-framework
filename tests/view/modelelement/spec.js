describe("oomodelelement.js", function() {

    describe("constructor", function() {
        var el = null;
        beforeEach(function () {
            el = new oo.view.ModelElement({"template":"test", "el" : "#elem-target"});
        });
        
        it("should be an instanceof oo.view.Element", function () {
            expect(el instanceof oo.view.Element).toBeTruthy();
        });
    });

    describe("methods", function(){
        var el = null;

        beforeEach(function () {
            el = new oo.view.ModelElement({el: '#elem-target'});
        });

        describe("setModel", function() {
           it('_model must an instance of oo.data.Model', function() {
                el.setModel({name:'test', provider: 'fake'});
                expect(el._model instanceof oo.data.Model).toBeTruthy();
            });
        });
    });

    describe('render', function(){
        var provider = new oo.data.FakeProvider({
            "name" : "fdsfsdf"
        });

        var model = oo.createModel({
            'name' : "test",
            'provider' : provider
        });

        var list2 = new oo.view.ModelElement({
            model : model,
            'template' : '<span class="h1">{{firstname}}</span> | <span class="h2">{{nickname}}</span><br />',
            'el' : '#elem-target'
        });

        list2.render();
    });

});
