var model = oo.createModel({
    'name' : "test",
    'provider' : {
        type: 'ajax',
        url: 'categories.php',
        cacheProvider: 'fake'
    }
});


var articlesModel = oo.createModel({
    'name' : "test",
    'provider' : {
        type: 'ajax',
        url: 'articles.php',
        cacheProvider: 'fake'
    }
});