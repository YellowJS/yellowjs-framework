var oo = (function (oo){
    var global = this,
        view = oo.getNS('oo.view'),
        viewRepository = {};
    
    view.Element = my.Class(oo.view.Dom, {
        STATIC: {
            register: function register (cls, codename) {
                if (viewRepository[codename])
                    throw 'Already existing codename';

                viewRepository[codename] = cls;
            },
            get: function get (codename) {
                if (codename in viewRepository)
                    return viewRepository[codename];
                else
                    throw 'Invalid codename';
            },
            unregister: function register (codename) {
                delete viewRepository[codename];
            },
            setTemplate : function setTemplate(cls){
                view.Element.templateEngine = cls;
            },
            templateEngine : null
        },
        constructor: function (options) {
        }
    });

    return oo;

})(oo || null);