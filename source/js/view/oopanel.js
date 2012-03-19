/**
 * Abstract class that should be extended to create panels
 *
 * @namespace oo.core
 * @private class
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function (oo) {

    var Panel =  oo.getNS('oo.view').Panel = oo.Class(oo.view.Element, oo.core.mixins.Events, oo.core.mixins.Scroll, {
        STATIC : {
            ON_SHOW: 'on_show',
            ON_HIDE: 'on_hide'
        },
        // references elements registered into this view
        _uiElements: null,
        constructor: function constructor() {

            Panel.Super.call(this, {el: document.createElement('div')});

            this._uiElements = {};

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
            this.appendHtml(Panel.Super.prototype.render.call(this));

            return this;
        },
        initElement: function initElement() {
            
            for (var id in this._uiElements) {
                var el = this._uiElements[id];
                if ('needToRender' in el && el.needToRender())
                    el.renderTo(this);
            }

            return this;
        },
        destroy: function destroy () {
            // for (var id in this._uiElements)
            //     this._uiElements[id].destroy();
        },
        show: function show(direction) {
            this.animShow();
            this.triggerEvent(Panel.ON_SHOW, [this]);
        },
        animShow: function animShow (direction) {

            var Viewport = oo.view.Viewport, vp = oo.getViewport();

            direction = direction || Viewport.ANIM_RTL;

            var anim_duration = 0;
            if (direction !== Viewport.NO_ANIM) {
                // prepare transition
                var translateDist = vp.getWidth() * (direction == Viewport.ANIM_RTL ? 1 : -1);
                this.setTranslateX(translateDist);
                anim_duration = Viewport.ANIM_DURATION;
            }

            this.setDisplay('block', '');

            var _this = this;
            this.translateTo({x:0}, anim_duration);
        },
        hide: function hide(direction) {

            this.animHide(direction);

            this.triggerEvent(Panel.ON_HIDE);
        },
        animHide: function animHide (direction) {
            var Viewport = oo.view.Viewport, vp = oo.getViewport();

            direction = direction || Viewport.ANIM_RTL;

            var anim_duration = 0;
            if (direction !== Viewport.NO_ANIM) {
                anim_duration = Viewport.ANIM_DURATION;
            }

            // transition
            var translateDist = vp.getWidth() * (direction == Viewport.ANIM_RTL ? -1 : 1);
            var that = this;
            this.translateTo({x:translateDist}, Viewport.ANIM_DURATION, function () {
                that.setDisplay('none');
            });
        }
    });

})(oo || {});