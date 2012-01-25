var oo = (function (oo){
    var global = this,
        view = oo.getNS('oo.view'),
        viewRepository = {};
    
    var Element = view.Element = my.Class(oo.view.Dom, {
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
                if (null == Element.templateEngine)
                    Element.templateEngine = new (oo.view.templateengine.Template.get(oo.getConfig('templateEngine')))();

                return Element.templateEngine;
            },
            templateEngine : null
        },
        _tpl : null,
        _model : null,
        constructor: function constructor (options) {
            if(!options || typeof options != 'object')
                throw "call Element constructor but \"options\" missing";

            if(!options.hasOwnProperty('target'))
                throw "call Element constructor but \"target\" property of object options is missing";

            Element.Super.call(this, options.target);

            if( options.hasOwnProperty('model') ){
                this.setModel(options.model);
                delete options.model;
            }

            if( options.hasOwnProperty('template') ){
                this.setTemplate(options.template);
                delete options.template;
            }

            if (this._model){
                this._model.addListener(oo.data.Model.AFTER_FETCH, oo.createDelegate(this.afterFetch, this));
            }

        },
        afterFetch : function afterFetch(data){
            this.render(data);
        },
        setModel : function setModel(model){
            if (model instanceof oo.data.Model)
                this._model = model;
            else
                this._model = oo.createModel(model);
        },
        setTemplate : function setTemplate(tpl){
            this._tpl = tpl || '';
        },
        prepareData: function prepareData(data) {
            return data;
        },
        render: function render (data, tpl) {
            if (!data)
                data = {};

            if (!tpl || '' === tpl)
                tpl = this._tpl;

            if(!tpl) return;
            var tplEng = Element.getTemplateEngine();
            
            this.clear();
            this.appendHtml(tplEng.render(tpl, this.prepareData(data)));
        }

    });

    return oo;

})(oo || null);