/**
 * Abstract class that should be extended to create panels
 *
 * @namespace oo.core
 * @private class
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function (oo) {

    var Panel =  oo.getNS('oo.view').Panel = oo.Class(oo.view.Element, {
        // references elements registered into this view
        _uiElements: {},
        constructor: function constructor() {

            Panel.Super.call(this, {el: document.createElement('div')});

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
        },
        initElement: function initElement() {
            
            for (var id in this._uiElements) {
                var el = this._uiElements[id];
                if (el.needToRender())
                    el.renderTo(this);
            }

            return this;
        },
        destroy: function destroy () {
            // for (var id in this._uiElements)
            //     this._uiElements[id].destroy();
        },
        show: function show(direction) {
            this.setDisplay('block', '');
            
            //var index = this._identifierToIndex(panel);

            var Viewport = oo.view.Viewport, vp = oo.getViewport();

            direction = direction || Viewport.ANIM_RTL;

            var anim_duration = 0;
            if (direction !== Viewport.NO_ANIM) {
                // prepare transition
                var translateDist = vp.getWidth() * (direction == Viewport.ANIM_RTL ? 1 : -1);
                this.setTranslateX(translateDist);
                // this.getPanel(index).setDisplay('', '');
                anim_duration = Viewport.ANIM_DURATION;
            }

            this.translateTo({x:0}, anim_duration);

            this.triggerEvent('onShow');
        },
        hide: function hide(direction) {
            //var index = this._identifierToIndex(panel);

            var Viewport = oo.view.Viewport, vp = oo.getViewport();

            direction = direction || Viewport.ANIM_RTL;

            var anim_duration = 0;
            if (direction !== Viewport.NO_ANIM) {
                anim_duration = Viewport.ANIM_DURATION;
            }

            // transition
            var translateDist = vp.getWidth() * (direction == Viewport.ANIM_RTL ? -1 : 1);
            // this.getPanel(index).setZIndex(3, '');
            var that = this;
            this.translateTo({x:translateDist}, Viewport.ANIM_DURATION, function () {
                // that.getPanel(index).setDisplay('none');
                that.setDisplay('none');
                that.stopAnimation();
            });

            this.triggerEvent('onHide');

        }
    });

})(oo || {});