var oo = (function (oo){
    var global = this;
    var tplEngine = oo.getNS('oo.view.templateengine');

    var templateRepository = {};

    var Template = tplEngine.Template = oo.Class({
        STATIC: {
            register: function register (cls, codename) {
                if (templateRepository[codename])
                    throw 'Already existing codename';

                templateRepository[codename] = cls;
            },
            get: function get (codename) {
                if (codename in templateRepository)
                    return templateRepository[codename];
                else
                    throw 'Invalid codename';
            },
            unregister: function register (codename) {
                delete templateRepository[codename];
            }
        },
        constructor: function (options) {
            /*if (options && 'name' in options && typeof options.name == 'string')
                this._name = options.name;
            else
                throw 'Config object must contain a name property';*/
        },
        render: function (tpl, datas) {
            throw 'Can\'t be called directly from Template class';
        }
    });

    return oo;

})(oo || {});