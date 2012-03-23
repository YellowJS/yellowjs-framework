/**
 * Abstract class that should be extended to create panels
 *
 * @namespace oo.core
 * @private class
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function (oo) {

    var Panel =  oo.getNS('oo.view').Panel = oo.Class(oo.view.Element, oo.core.mixins.Scroll, {
        STATIC : {
            ON_SHOW: 'on_show',
            ON_HIDE: 'on_hide'
        },
        // references elements registered into this view
        _uiElements: null,
        _data: {},
        constructor: function constructor() {

            Panel.Super.call(this, {el: document.createElement('div')});

            this._uiElements = {};
            var that = this;
            //window.addEventListener('orientationchange', that.refresh,false);
            
            if ('init' in this)
                this.init();
        },
        getEl: function getEl(id) {
            return this._uiElements[id] || null;
        },
        addEl: function addEl(el) {
            this._uiElements[el.getId()] = el;
            el.setContainer(this);
        },
        removeEl: function removeEl(id) {
            var el = this.getEl(id);
            if (null !== el) {
                this._uiElements.slice(this._uiElements.indexOf(el), 1);
                el.destroy();
            }
        },
        // deprecated -> please use "addEl()" method instead
        register: function register(el) {
            oo.warn('the method oo.view.Panel.register() is deprecated, please use addEl instead');
            this.addEl(el);
        },
        setData: function setData (data) {
            this._data = data || {};
        },
        render: function render() {
            this.classList.addClass('oo-panel');
            this.appendHtml(Panel.Super.prototype.render.call(this, this._data));

            return this;
        },
        /**
         * do exactly the same thing as the oo.view.Element.createElement and automatically add the created element to the current panel
         * @see oo.view.Element.createElement
         */
        createElement: function createElement() {
            var el = Panel.Super.prototype.createElement.apply(this, arguments);
            this.addEl(el);
            return el;
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
            this.animShow(direction);
            this.triggerEvent(Panel.ON_SHOW, [this]);
        },
        animShow: function animShow (direction) {

            var Viewport = oo.view.Viewport, vp = oo.getViewport();

            direction = direction || Viewport.ANIM_RTL;

            var anim_duration = 0;
            if (direction !== Viewport.NO_ANIM) {
                // prepare transition
                //vp.getWidth(false, true) :
                //Warning : avoid the cached dom value cause bug in android navigator when orientationchange is fired
                var translateDist = vp.getWidth(false, true) * (direction == Viewport.ANIM_RTL ? 1 : -1);
                this.setTranslateX(translateDist);
                anim_duration = Viewport.ANIM_DURATION;
            }

            this.setDisplay('block', '');

            var _this = this;
            this.translateTo({x:0}, anim_duration);
        },
        hide: function hide(direction) {
            this.animHide(direction);
            this.triggerEvent(Panel.ON_HIDE, [this]);
        },
        animHide: function animHide (direction) {
            var Viewport = oo.view.Viewport, vp = oo.getViewport();

            direction = direction || Viewport.ANIM_RTL;

            var anim_duration = 0;
            if (direction !== Viewport.NO_ANIM) {
                anim_duration = Viewport.ANIM_DURATION;
            }

            // transition
            //vp.getWidth(false, true) :
                //Warning : avoid the cached dom value cause bug in android navigator when orientationchange is fired
            var translateDist = vp.getWidth(false, true) * (direction == Viewport.ANIM_RTL ? -1 : 1);
            var that = this;
            this.translateTo({x:translateDist}, Viewport.ANIM_DURATION, function () {
                that.setDisplay('none');
            });
        },
        _onEnabled: function _onEnabled() {
            this.onEnabled();
            this.initElement();
        },
        refresh: function refresh(){
          var vp = oo.getViewport();
          vp.getWidth(null, true);
          vp.getHeight(null, true);
        }
    });

})(oo || {});