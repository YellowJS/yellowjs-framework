/**
 * Element are the most basic type of UI element that could be created with the framework
 *
 * @namespace oo.view
 * @class Element
 * @requires oo.view.Dom
 * @requires oo.core.mixins.Scroll
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 * @author Claire Sosset <m.desloges@gmail.com> || @Claire_So
 */
(function (oo){
    var global = this,
        viewRepository = {};
    
    var Element = oo.getNS('oo.view').Element = oo.Class(oo.view.Dom, oo.core.mixins.Scroll, {
        STATIC: {
            APPEND : 'append',
            PREPEND : 'prepend',
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

        _needToRender: true,
        
        _tpl : null,
        
        _container: null,

        constructor: function constructor (options) {
            if(!options || typeof options != 'object')
                throw "call Element constructor but \"options\" missing";

            // target property is deprecated - use el instead
            if(!options.hasOwnProperty('el'))
                throw "call Element constructor but \"el\" property of object options is missing";

            Element.Super.call(this, options.el);

            if( options.hasOwnProperty('template') ){
                this.setTemplate(options.template);
                delete options.template;
            }

        },
        setContainer: function setContainer(container) {
            this._container = container;
        },
        _getContainer: function _getContainer() {
            return this._container;
        },
        needToRender: function needToRender() {
            return this._needToRender;
        },
        setTemplate : function setTemplate(tpl){
            this._tpl = tpl || '';
        },
        getTemplate : function getTemplate(){
          return this._tpl;
        },
        /**
         * render the element and return the generated html as string
         *
         * @param  {object} OPTIONAL data literal object representing data to fill the template
         * @param  {sting} OPTIONAL tpl   a template to override temporary the element's template
         * @return {string}               generated html as string
         */
        render: function render (data, tpl) {

            if (!tpl || '' === tpl)
                tpl = this.getTemplate();

            if(!tpl) return '';
            var tplEng = Element.getTemplateEngine();

            return tplEng.render(tpl, data || {});
        },
        /**
         * render the current element and insert the generated html into a target
         *
         * @param  {oo.view.Dom} target   the object in wich the content should be inserted
         * @param  {object} OPTIONAL data literal object representing data to fill the template
         * @param  {sting} OPTIONAL tpl   a template to override temporary the element's template
         * @param  {string} position      use a constant to append / prepend / set generated content
         * @return {void}
         */
        renderTo: function renderTo (target, data, tpl, position) {
            var content = this.render(data, tpl),
                currentTarget = target.find('#' + this.getId()) || target;

            position = position || '';

            if (typeof content === 'string')
                currentTarget[position + (position ? 'H': 'h') + 'tml'](content);
            else
                currentTarget.appendChild(content);
        },
        /**
         * do exactly the same thing as the oo.createElement, but add a prefix to the el property in order to "scope" the newly created element into the current one (for Dom query performance purpose)
         * @see oo.createElement
         */
        createElement: function createElement (type, opt) {
            if (opt.el)
                opt.el = '#' + this.getId() + ' ' + opt.el;
            return oo.createElement(type, opt);
        }
        //deprecated
        /*,
        setScrollable: function setScrollable (orientation) {
            //if (null === this.getDomObject.querySelector('.content'))
            var scroll = new oo.view.Scroll(this.getDomObject(), orientation, orientation);
        }*/
    });

    oo.view.Element.register(Element, 'node');

})(oo);