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
        target : '#pager',
        model : modelArticle,
        template : '<img src="{{picture}}" />'
    };

    var pager = oo.createElement('pager',opt);
    pager.addEventListener('navigate',function(){
        app.router();
        
    });

    modelArticle.fetch();

});