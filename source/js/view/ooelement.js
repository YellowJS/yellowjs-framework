(function (oo){
    var global = this,
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

        // read only property
        _needToRender: true,
        needToRender: function needToRender() {
            return this._needToRender;
        },
        
        _tpl : null,
        constructor: function constructor (options) {
            if(!options || typeof options != 'object')
                throw "call Element constructor but \"options\" missing";

            // target property is deprecated - use el instead
            if(!options.hasOwnProperty('target') && !options.hasOwnProperty('el'))
                throw "call Element constructor but \"el\" property of object options is missing";

            Element.Super.call(this, options.el || options.target);

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

            if(!tpl) return '';
            var tplEng = Element.getTemplateEngine();

            return tplEng.render(tpl, data || {});
        },
        renderTo: function renderTo (target, data, tpl) {
            var content = this.render(data, tpl);
            if (typeof content === 'string')
                target.appendHtml(content);
            else
                target.appendChild(content);
        },
        // do exactly the same thing as the oo.createElement, but add a prefix to the el property
        // in order to "scope" the newly created element into the current one
        createElement: function createElement (type, opt) {
            if (opt.el)
                opt.el = '#' + this.getId() + ' ' + opt.el;
            return oo.createElement(type, opt);
        },
        setScrollable: function setScrollable (orientation) {
            //if (null === this.getDomObject.querySelector('.content'))
            var scroll = new oo.view.Scroll(this.getDomObject(), orientation, orientation);
        }
    });

    oo.view.Element.register(Element, 'node');

})(oo);