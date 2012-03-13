/**
 * Manage root screen in application
 *
 * @namespace oo.view
 * @class Viewport
 * @requires oo.view.Dom
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function (oo) {
    
    // shorthand
    var global = this;

    var Viewport = oo.getNS('oo.view').Viewport = oo.Class(oo.view.Dom, {

        STATIC : {
            ANIM_RTL : 'rtl',
            ANIM_LTR : 'ltr',
            NO_ANIM : 'none',
            ANIM_DURATION : 750
        },
        constructor : function constructor(root){
            root = root || oo.getConfig('viewportSelector');

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
         *
         * @param panel {String} identifier as string or index
         **/
        hasPanel : function hasPanel(panel) {
           return -1 != this._panelsDic.indexOf(panel) ? true : false;
        },
        /**
         * add a panel to the viewport
         *
         * @param identifier {string} a name that will be used as reference to the panel
         * @parma autoShow {bool} [OPTIONAL] will render/show the panel directly after adding it
         * @param autoRender {bool|string} [OPTIONAL] will render the panel directly after adding - if the autoShow param is set to true then it is used as animDirection
         * @param animDirection {string} [OPTIONAL] define an animation (use constant)
         **/
        addPanel : function addPanel(identifier, autoShow, autoRender, animDirection){
            
            var p = new (this._panelClasses[identifier])();
            p.setId(identifier);

            this._panels.push(p);
            this._panelsDic.push(identifier);

            if (autoRender || autoShow) {
                if (!this.panelIsEnable(identifier))
                    this._enablePanel(identifier);
            }

            if (autoShow) {
                animDirection = autoRender || animDirection;

                this.showPanel(identifier, animDirection);
            }
        },
        _identifierToIndex : function _identifierToIndex(identifier){
            var index;
            if (typeof identifier == 'string') {
                index = this._panelsDic.indexOf(identifier);
            }
            return index;
        },
        _indexToIdentifier : function _indexToIdentifier(index){
           return this._panelsDic[index];
        },
        _enablePanel : function _enablePanel(identifier){
            var index = this._identifierToIndex(identifier),
                panel = this._panels[index];

            panel.renderTo(this);

            if ('onEnabled' in panel) {
                panel.onEnabled();
            }
            panel.initElement();

            this._enabledPanels.push(index);
        },
        getFocusedPanel : function getFocusedPanel(getIndex){
            index = this._focusedStack[this._focusedStack.length - 1];
            if (getIndex) {
                return undefined !== index ? index : false;
            } else {
                return this.getPanel(this._indexToIdentifier(index));
            }
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
         *
         * @param {string|int} the panel string identifier or index
         * @param {direction} Right To Left or Left To Right or no anim (use constant)
         * @param params are data come from the model to be passed in the view
         **/
        showPanel : function showPanel(panelIdentifier, direction, params) {
            var p = this.getPanel(panelIdentifier);
            
            if (!this.panelIsEnable(panelIdentifier))
                this._enablePanel(panelIdentifier);

            p.show(direction || Viewport.ANIM_RTL, params);

            var index = this._identifierToIndex(panelIdentifier);

            this._focusedStack.push(index);

        },
        hidePanel : function hidePanel(panelIdentifier, direction, destroy) {
            direction = direction || Viewport.ANIM_RTL;

            this.getPanel(panelIdentifier).hide(direction || Viewport.ANIM_RTL);

            var index = this._identifierToIndex(panelIdentifier);

            if (index == this.getFocusedPanel(true)) {
                this._focusedStack.pop();
            }
        },
        /**
         * show the newPanel and hide the oldPanel
         * this method usualy takes three parameter, you may pass only two (first as the new Panel, and second
         * as the direction of the animation) the current panel will be auto hidden
         *
         * @param oldPanel the panel to hide
         * @param newPanel the panel to show
         * @param direction define an animation for both hide and show transitions (use constant)
         * @param params are data come from model to be passed at the view
         **/
        switchPanel : function switchPanel(oldPanel, newPanel, direction, params) {
            var dir, oldP, newP;

            if (arguments.length <= 2) {
                dir = newPanel || Viewport.ANIM_RTL;
                newP = oldPanel;
                oldP = this._indexToIdentifier(this.getFocusedPanel(true));
            } else {
                oldP = oldPanel;
                newP = newPanel;
                dir = direction;
            }
                
            this.showPanel(newP, dir, params);

            if (oldP)
                this.hidePanel(oldP, dir);
        },
        /**
         * register a panel in order to make the vieport able to manage it
         *
         * @param  {String} id an identifier
         * @param  {oo.view.Panel} p  the panel to register
         * @return {void}
         */
        register: function register(id, p) {
            this._panelClasses[id] = p;
        },
        /**
         * retunrs the panel object associated with the given identifier
         *
         * @param {String} identifier the identifier that had been used to register/create the panel
         * @return {oo.view.Panle} the Panel
         **/
        getPanel : function getPanel(identifier) {
            if (!this.hasPanel(identifier))
                this.addPanel(identifier, false, false);

           return this._panels[this._identifierToIndex(identifier)] || false;
        },
        /**
         * @deprecated
         * DO NOT USE IT ANYMORE !!!
         *
         * @param  {[type]}   identifier [description]
         * @param  {Function} fn         [description]
         * @return {[type]}
         */
        show: function show (identifier, fn) {
            if (!this.hasPanel(identifier)) {
                this.addPanel(identifier, true);
            }

            if (typeof fn == 'function')
                fn.call(global, this.getPanel(this._identifierToIndex(identifier)));
        }
    });
    
})(oo || {});