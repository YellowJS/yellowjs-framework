describe("oopager.js", function() {
    /*var router = oo.getRouter();
    router.addEventListener('navigate',function(){
        alert('ok');
    });*/
    
    
    var provider = new oo.data.FakeProvider({
        "name" : "fdsfsdf"
    });

    var modelArticle = oo.createModel({
        'name' : "test",
        'provider' : provider
    });

    var opt = {
        el : '#pager',
        model : modelArticle,
        template : '<img src="{{picture}}" />'
    };

    var pager = oo.createElement('pager',opt);
    
    modelArticle.fetch();

});