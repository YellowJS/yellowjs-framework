(function (oo){
    var global = this,
        view = oo.getNS('oo.view'),
        viewRepository = {};
    
    var Element = oo.getNS('oo.view').Element = oo.Class(oo.view.Dom, {
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

            getTemplateEngine : function getTemplateEngine() {
                if (null === Element.templateEngine)
                    Element.templateEngine = new (oo.view.templateengine.Template.get(oo.getConfig('templateEngine')))();

                return Element.templateEngine;
            },
            templateEngine : null
        },
        _tpl : null,
        constructor: function constructor (options) {
            if(!options || typeof options != 'object')
                throw "call Element constructor but \"options\" missing";

            if(!options.hasOwnProperty('target'))
                throw "call Element constructor but \"target\" property of object options is missing";

            Element.Super.call(this, options.target);

            if( options.hasOwnProperty('template') ){
                this.setTemplate(options.template);
                delete options.template;
            }

        },
        setTemplate : function setTemplate(tpl){
            this._tpl = tpl || '';
        },
        render: function render (data, tpl) {
            if (!tpl || '' === tpl)
                tpl = this._tpl;

            if(!tpl) return;
            var tplEng = Element.getTemplateEngine();

            this.clear();
            return tplEng.render(tpl, data || {});
            //this.appendHtml(tplEng.render(tpl, data || {}));
        }

    });

    oo.view.Element.register(Element, 'node');

})(oo);