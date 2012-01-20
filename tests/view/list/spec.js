describe("oolist.js", function() {
    oo.define({
        templateEngine : 'mustache'
    });

    var conf = {"model" : "test", "template":"test", "target" : "#domtest"};

    describe("constructor", function() {
        var list = oo.createElement('list',conf);
        
        it('_tpl must be equal to "test"', function() {
            expect(list._tpl).toEqual("test");
        });

        it('_model must be equal to "test"', function() {
            //list.setModel('test');
            expect(list._model).toEqual("test");
        });

        it('_target must be an instance of oo.view.Dom', function(){
            //list.settarget('#domtest');
            expect(list._target instanceof oo.view.Dom).toBeTruthy();
        });

        it('_target must have id "domtest"', function(){
            var id = list._target.getId();
            expect(id).toEqual('domtest');
        });
    });

    describe("methods", function(){
       var list = oo.createElement('list');

       describe("settarget", function() {
           it('_tpl must be equal to "test"', function() {
                list.setTemplate('test');
                expect(list._tpl).toEqual("test");
            });
        });

        describe("setModel", function() {
           it('_model must be equal to "test"', function() {
                list.setModel('test');
                expect(list._model).toEqual("test");
            });
        });

        describe("settarget", function() {
            it('_target must be an instance of oo.view.Dom and has id domtest', function(){
                list.settarget('#domtest');
                expect(list._target instanceof oo.view.Dom).toBeTruthy();
                
                var id = list._target.getId();
                expect(id).toEqual('domtest');
            });
        });

        describe("_transformToOoDom", function() {
            it('must return an instanceof oo.view.Dom', function(){
                var res = list._transformToOoDom("#another-dom-test");
                expect(res instanceof oo.view.Dom).toBeTruthy();
            });
        });
    });

    describe('render', function(){
        var provider = new oo.data.Fakeprovider({
            "name" : "fdsfsdf"
        });

        var model = oo.createModel({
            'id' : "test",
            'provider' : provider
        });

        var list2 = oo.createElement('list', {
            model : model,
            'template' : '<li>{{title}}</li>',
            'target' : '#target'
        });

        model.fetch();
    });
});