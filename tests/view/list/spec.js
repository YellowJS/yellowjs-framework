describe("oolist.js", function() {
    describe("constructor", function() {
        var conf = {"model" : "test", "template":"test", "wrapper" : "#domtest"};
        var list = oo.createList(conf);

        it('_tpl must be equal to "test"', function() {
            expect(list._tpl).toEqual("test");
        });

        it('_model must be equal to "test"', function() {
            //list.setModel('test');
            expect(list._model).toEqual("test");
        });

        it('_wrapper must be an instance of oo.view.Dom', function(){
            //list.setWrapper('#domtest');
            expect(list._wrapper instanceof oo.view.Dom).toBeTruthy();
        });

        it('_wrapper must have id "domtest"', function(){
            var id = list._wrapper.getId();
            expect(id).toEqual('domtest');
        });
    });

    var list = oo.createList();
    describe("setWrapper", function() {
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

    describe("setWrapper", function() {
        it('_wrapper must be an instance of oo.view.Dom and has id domtest', function(){
            list.setWrapper('#domtest');
            expect(list._wrapper instanceof oo.view.Dom).toBeTruthy();
            
            var id = list._wrapper.getId();
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