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
        constructor: function constructor() {
            // references elements registered into this view
            this._uiElements = {};

            Panel.Super.call(this, document.createElement('div'));

            if ('init' in this)
                this.init();
        },
        getEl: function getEl(id) {
            return this._uiElements[id];
        },
        register: function register(el) {
            this._uiElements[el.getId()] = el;
        },
        render: function render() {
            this.classList.addClass('oo-panel');

            Panel.Super.prototype.render.call(this);
        },
        hide: function hide() {
            this.setDisplay('none', '');
        },
        show: function show() {
            this.setDisplay('', '');
        }
    });

    return oo;

})(oo || {});