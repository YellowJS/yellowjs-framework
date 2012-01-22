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

            setTemplateEngine : function setTemplateEngine(tplEngine) {
                if (typeof tplEngine == 'string')
                    tplEngine = new (oo.view.templateengine.Template.get(tplEngine))();

                Element.templateEngine = tplEngine;
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

            console.log(Element);
            Element.Super.call(this, options.target);

            if( options.hasOwnProperty('model') ){
                var model = null;
                if (options.model instanceof oo.data.Model)
                    model = options.model;
                else
                    model = oo.createModel(options.model);
                
                this.setModel(model);
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
        afterFetch : function afterFetch(datas){
            this.render(datas);
        },        
        setModel : function setModel(model){
            this._model = model || null;
        },
        setTemplate : function setTemplate(tpl){
            this._tpl = tpl || null;
        },       
        render: function render (data, tpl) {
            this.appendHtml(Element.templateEngine.render(datas, this._tpl));
        }

    });

    return oo;

})(oo || null);