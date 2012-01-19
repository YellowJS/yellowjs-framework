var oo = (function(oo){
    var global = this,
        view = oo.getNS('oo.view'),
        viewRepository = {};
    
    view.Element = my.Class({
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
            }
        },
        _name: '',
        constructor: function (options) {
            if (options && 'name' in options && typeof options.name == 'string')
                this._name = options.name;
            else
                throw 'Config object must contain a name property';
        },
        attachToDom : function attachToDom(){
            //to do
        }
    });

    return oo;

})(oo || null);