var oo = (function (oo) {
    
    // shorthand
    var Dom = oo.view.Dom, exports = oo.getNS('oo.view'), global = this;

    var Viewport = my.Class(Dom, oo.core.mixins.Events, {

        STATIC : {
            ANIM_RTL : 'rtl',
            ANIM_LTR : 'ltr',
            NO_ANIM : 'none',
            ANIM_DURATION : 500
        },
        constructor : function constructor(root){
            root = root || 'body';

            Viewport.Super.call(this, root);

            // give access to classList of the root node
            // this.classList = this._root.classList;

            this._panelClasses = {};
            this._panels = [];
            this._panelsDic = [];
            this._enabledPanels = [];        
            this._focusedStack = [];
        },
        /**
         * return true if the panel has already been added
         * @param panel {String} identifier as string or index
         **/
        hasPanel : function hasPanel(panel) {
           return -1 != this._panelsDic.indexOf(panel) ? true : false; 
        },
        /**
         * add a panel to the viewport
         * @param view {string} a template string
         * @param identifier {string} a name that will be used as reference to the panel
         * @autoShow {bool} will render/show the panel directly after adding it
         * @autoRender {bool|string} will render the panel directly after adding - if the autoShow param is set to true then it is used as animDirection
         * @animDirection {string} define an animation (use constant)
         **/
        addPanel : function addPanel(identifier, autoShow, autoRender, animDirection){
            
            var p = new (this._panelClasses[identifier])();

            this._panels.push(p);
            this._panelsDic.push(identifier);

            if (autoShow) {
                animDirection = autoRender || animDirection;
                p.render();
                this.showPanel(identifier, animDirection);
            } else {
                if (autoRender) {
                    p.render();
                }
            }
        },
        _identifierToIndex : function _identifierToIndex(identifier){
            var index = identifier;
            if (typeof index == 'string') {
                index = this._panelsDic.indexOf(index);
            }
            return index;
        },
        _indexToIdentifier : function _indexToIdentifier(index){
           return this._panelsDic[index];
        },
        _enablePanel : function _enablePanel(identifier){
            var index = this._identifierToIndex(identifier);

            this.appendChild(this._panels[index]);

            this._enabledPanels.push(index);

            if ('onEnabled' in this._panels[index]) {
                this._panels[index].onEnabled();
            }

            // useless
            // hook to initialize view components such as vscroll or carousel
            // @todo : change the sender, should not be sent by the panel but the visible API is nicer this way    
            // this.triggerEvent('onEnablePanel', this._panels[index], [{identifier: this._indexToIdentifier(index), panel: this._panels[index]}]);
        },
        getFocusedPanel : function getFocusedPanel(getIndex){
            index = this._focusedStack[this._focusedStack.length - 1];
            if (getIndex) {
                return undefined !== index ? index : false;
            } else {
                return this.getPanel(index);
            }
        },
        /**
         * return the Panel as a oo.Dom object 
         **/
        getPanel : function getPanel(identifier) {
           return this._panels[this._identifierToIndex(identifier)] || false;
        },
        panelIsEnable : function panelIsEnable(identifier) {
           return (-1 != this._enabledPanels.indexOf(this._identifierToIndex(identifier)) ? true : false);
        },
        removePanel : function removePanel(panel) {
           var index = this._identifierToIndex(panel);

           // event ?
           this._panels[index].destroy();

           this._panels.slice(index, 1);
           this._panelsDic.slice(index, 1);
        },
        /**
         * show a panel with a optional animation
         * @param {string|int} the panel string identifier or index
         * @param {direction} Right To Left or Left To Right or no anim (use constant)
         **/
        showPanel : function showPanel(panel, direction) {
            var index = this._identifierToIndex(panel);

            direction = direction || Viewport.ANIM_RTL;

            var anim_duration = 0;
            if (direction !== Viewport.NO_ANIM) {
                // prepare transition
                var translateDist = this.getWidth() * (direction == Viewport.ANIM_RTL ? 1 : -1);
                this.getPanel(index).setTranslateX(translateDist);
                // this.getPanel(index).setDisplay('', '');
                anim_duration = Viewport.ANIM_DURATION;
            }

            if (!this.panelIsEnable(index)) {
                this._enablePanel(index);
            }

            // transition
            // this.getPanel(index).setZIndex(5, '');
            this.getPanel(index).translateTo({x:0}, anim_duration);

            this._focusedStack.push(index);

            // @todo : change the sender, should not be sent by the panel but the visible API is nicer this way
            this.triggerEvent('onShowPanel', this._panels[index], [{identifier: this._indexToIdentifier(index), panel: this._panels[index]}]);
        },
        hidePanel : function hidePanel(panel, direction, destroy) {
            var index = this._identifierToIndex(panel);

            direction = direction || Viewport.ANIM_RTL;

            var anim_duration = 0;
            if (direction !== Viewport.NO_ANIM) {
                anim_duration = Viewport.ANIM_DURATION;
            }

            // transition
            var translateDist = this.getWidth() * (direction == Viewport.ANIM_RTL ? -1 : 1);
            // this.getPanel(index).setZIndex(3, '');
            var that = this;
            this.getPanel(index).translateTo({x:translateDist}, Viewport.ANIM_DURATION, function () {
                // that.getPanel(index).setDisplay('none');
                that.getPanel(index).stopAnimation();
            });

            if (index == this.getFocusedPanel(true)) {
                this._focusedStack.pop();
            }

            this.triggerEvent('onHidePanel', this, [{identifier: this._indexToIdentifier(index), panel: this._panels[index]}]);
        },
        /**
         * show the newPanel and hide the oldPanel
         * this method usualy takes three parameter, you may pass only two (first as the new Panel, and second
         * as the direction of the animation) the current panel will be auto hidden
         * @param oldPanel the panel to hide
         * @param newPanel the panel to show
         * @param define an animation for both hide and show transitions (use constant)
         **/
        switchPanel : function switchPanel(oldPanel, newPanel, direction) {
            var dir, oldP, newP;

            if (typeof arguments[1] == 'string' || 1 == arguments.length) {
                dir = newPanel;
                newP = oldPanel;
                oldP = this.getFocusedPanel(true);
            } else {
                oldP = oldPanel;
                newP = newPanel;
                dir = direction;
            }

            this.showPanel(newP, dir);

            if (false !== oldP) {
                this.hidePanel(oldP, dir);
            }
        },

        register: function register(id, p) {
            this._panelClasses[id] = p;
        },
        show: function show(identifier, fn) {
            if (!this.hasPanel(identifier)) {
                this.addPanel(identifier, true);
            }

            if (typeof fn == 'function')
                fn.call(global, this.getPanel(this._identifierToIndex(identifier)));
        }
    });

    exports.viewport = new Viewport();
    // exports.Viewport = Viewport;
    
    return oo;
    
})(oo || {});