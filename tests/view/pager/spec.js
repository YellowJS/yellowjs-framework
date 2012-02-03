describe("oopager.js", function() {
    var router = oo.getRouter();
    console.log(router);
    
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

    modelArticle.fetch();
    

});