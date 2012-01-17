describe("oodom.js", function() {
    var conf = {"model" : "test", "template":"test"};
    var list = oo.createList(conf);
    
    it('list must be an instance of oo.view.List', function(){
        expect(list instanceof oo.view.List).toBeTruthy();
    });

    it('_tpl must be equal to "test"', function() {
        //list.setTemplate('test');
        expect(list._tpl).toEqual("test");
    });

    it('_model must be equal to "test"', function() {
        //list.setModel('test');
        expect(list._model).toEqual("test");
    });

    it('_wrapper must be equal to "test"', function(){
        list.setWrapper('test');
        expect(list._wrapper).toEqual("test");
    });

});