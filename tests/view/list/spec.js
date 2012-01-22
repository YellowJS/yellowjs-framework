describe("oolist.js", function() {
    oo.define({
        templateEngine : 'mustache'
    });

    var conf = {"template":"test", "target" : "#domtest"};

    describe("constructor", function() {
        var list = oo.createElement('list', conf);
        
        it("should be an instanceof oo.view.Dom", function () {
            expect(list instanceof oo.view.Dom).toBeTruthy();
        })

        it('_tpl must be equal to "test"', function() {
            expect(list._tpl).toEqual("test");
        });

        it('_target must have id "domtest"', function(){
            var id = list.getId();
            expect(id).toEqual('domtest');
        });
    });

    describe("methods", function(){
       var list = oo.createElement('list', {target: '#domtest'});

       describe("setTemplate", function() {
           it('_tpl must be equal to "test"', function() {
                list.setTemplate('test');
                expect(list._tpl).toEqual("test");
            });
        });

        describe("setModel", function() {
           it('_model must an instance of oo.data.Model', function() {
                list.setModel({id:'test', provider: 'fake'});
                expect(list._model instanceof oo.data.Model).toBeTruthy();
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

        var list2 = oo.createElement('list', {
            model : model,
            'template' : '<span clss="h1">{{firstname}}</span><span clss="h2">{{nickname}}</span>',
            'target' : '#target'
        });

        model.fetch(function (data) {
            console.log(data);
        });
    });
});