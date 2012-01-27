/** 
 * Abstract class that should be extended to create panels
 * 
 * @namespace oo.core
 * @private class
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

    var e = oo.getNS('oo.view'), Dom = oo.view.Dom;

    var Panel = e.Panel = my.Class(Dom, {
        // references elements registered into this view
        _uiElements: {},
        constructor: function constructor() {
            
            Panel.Super.call(this, document.createElement('div'));

            if ('init' in this)
                this.init();
        },
        getEl: function getEl(id) {
            return this._uiElements[id];
        },
        addEl: function addEl(el) {
            this._uiElements[el.getId()] = el;
        },
        // deprecated -> please use "addEl()" method instead
        register: function register(el) {
            oo.warn('the method oo.view.Panel.register() is deprecated, please use addEl instead');
            this.addEl(el);
        },
        render: function render() {
            this.classList.addClass('oo-panel');

            Panel.Super.prototype.render.call(this);

            for (var el in this._uiElements) {
                if (el.needToRender())
                    this._uiElements[el].render();
            }
        },
        hide: function hide() {
            this.setDisplay('none', '');
        },
        show: function show() {
            this.setDisplay('block', '');
        }
    });

    return oo;

})(oo || {});