var app = (function(oo, app){
    
    var model = app.model || (app['model'] = {});

    model.mag = oo.createModel({
        "name" : "mag",
        "provider" : {
            "type" : "fake"
        }
    });


    return app;
})(oo, app || {});