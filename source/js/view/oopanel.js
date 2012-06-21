/**
 * Abstract class that should be extended to create panels
 * use the oo.createPanelClass helper
 *
 * @namespace oo.core
 * @private class
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function (oo) {

    var Panel =  oo.getNS('oo.view').Panel = oo.Class(oo.view.Element, {
        STATIC : {
            ON_SHOW: 'on_show',
            ON_HIDE: 'on_hide',
            ANIM_END: 'anim_end'
        },

        _data: null,
        _busy: false,

        constructor: function constructor() {

            Panel.Super.call(this, {el: document.createElement('div')});

            var that = this;
            //window.addEventListener('orientationchange', that.refresh,false);
            
            this._data = {};

            if ('init' in this)
                this.init();
        },
        render: function render() {
            this.classList.addClass('oo-panel');
            this.html(Panel.Super.prototype.render.call(this, this._data));

            return this;
        },
        destroy: function destroy () {
            // for (var id in this._uiElements)
            //     this._uiElements[id].destroy();
        },
        show: function show(direction) {
            if (this.isBusy())
                return;

            var that = this, cb = function () {
                this.removeListener(Panel.ANIM_END, cb);
                that._setFree();
            };
            this.addListener(Panel.ANIM_END, cb);

            this._setBusy();
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
            this.translateTo({x:0}, anim_duration, function () {
                _this.triggerEvent(Panel.ANIM_END);
            });
        },
        hide: function hide(direction) {
            if (this.isBusy())
                return;

            var that = this, cb = function () {
                this.removeListener(Panel.ANIM_END, cb);
                that._setFree();
            };
            this.addListener(Panel.ANIM_END, cb);

            this._setBusy();
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
            this.translateTo({x:translateDist}, anim_duration, function () {
                that.setDisplay('none');
                that.triggerEvent(Panel.ANIM_END);
            });
        },
        refresh: function refresh(){
          var vp = oo.getViewport();
          vp.getWidth(null, true);
          vp.getHeight(null, true);
        },
        setData: function setData (data) {
            this._data = data;
        },

        isBusy: function isBusy() {
            return this._busy;
        },

        _setBusy: function _setBusy() {
            this._busy = true;
            return this;
        },

        _setFree: function _setFree() {
            this._busy = false;
            return this;
        }
    });

})(yellowjs || {});