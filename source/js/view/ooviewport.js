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
            this._stages = {};
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
        /**
         * utility method to get an index from an string identifier
         *
         * @param  {string} identifier the panel string identifier
         * @return {int}
         */
        _identifierToIndex : function _identifierToIndex(identifier){
            var index;
            if (typeof identifier == 'string') {
                index = this._panelsDic.indexOf(identifier);
            }
            return index;
        },
        /**
         * utility method to get an identifier from an index
         *
         * @param  {int} a panel index
         * @return {string}
         */
        _indexToIdentifier : function _indexToIdentifier(index){
           return this._panelsDic[index];
        },
        /**
         * Enable a Panel, trigger the rendering of the panel
         *
         * @param  {strinf} identifier the panel string identifier
         * @return {void}
         */
        _enablePanel : function _enablePanel(identifier){
            var index = this._identifierToIndex(identifier),
                panel = this._panels[index];

            panel.renderTo(this);

            this._enabledPanels.push(index);
        },
        /**
         * return the current focused panel or its index in the panel repository
         *
         * @param  {bool} getIndex if true the returned value will be an index, else it will return the panel object itself
         * @return {oo.view.Panel|int}
         */
        getFocusedPanel : function getFocusedPanel(getIndex){
            index = this._focusedStack[this._focusedStack.length - 1];
            if (getIndex) {
                return undefined !== index ? index : false;
            } else {
                return this.getPanel(this._indexToIdentifier(index));
            }
        },
        /**
         * returns true if the panel has already been enabled
         *
         * @param  {string} identifier the panel string identifier
         * @return {bool}
         */
        panelIsEnable : function panelIsEnable(identifier) {
           return (-1 != this._enabledPanels.indexOf(this._identifierToIndex(identifier)) ? true : false);
        },
        /**
         * remove a panel from the viewport and destroy it
         *
         * @param  {string} panel the panel string identifier
         * @return {void}
         */
        removePanel : function removePanel(panel) {
            var index = this._identifierToIndex(panel);

            // event ?
            this._panels[index].destroy();

            this._panels.slice(index, 1);
            this._panelsDic.slice(index, 1);
            this._enabledPanels.slice(this._enabledPanels.indexOf(index), 1);
        },
        /**
         * show a panel with a optional animation
         *
         * @param {string} the panel string identifier
         * @param {direction} Right To Left or Left To Right or no anim (use constant)
         **/
        showPanel : function showPanel(panelIdentifier, direction) {
            var p = this.getPanel(panelIdentifier);
            
            if (!this.panelIsEnable(panelIdentifier))
                this._enablePanel(panelIdentifier);

            p.show(direction || Viewport.ANIM_RTL);

            var index = this._identifierToIndex(panelIdentifier);

            this._focusedStack.push(index);

        },
        /**
         * hide a panel with a optional animation
         *
         * @param {string|int} panelIdentifier the panel string identifier or index
         * @param {direction} direction Right To Left (ANIM_RTL) or Left To Right (ANIM_LTR) or no anim (NO_ANIM)
         * @param {bool} destroy destroy the panel or not (not implemented yet)
         **/
        hidePanel : function hidePanel(panelIdentifier, direction, destroy) {
            direction = direction || Viewport.ANIM_RTL;
            var p = this.getPanel(panelIdentifier);
            
            p.hide(direction || Viewport.ANIM_RTL);

            var index = this._identifierToIndex(panelIdentifier);

            if (index == this.getFocusedPanel(true)) {
                this._focusedStack.pop();
            }

            // if (destroy) {
            // }
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
        switchPanel : function switchPanel(oldPanel, newPanel, direction) {
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
                
            this.showPanel(newP, dir);

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
         */
        show: function show (identifier, fn) {
            if (!this.hasPanel(identifier)) {
                this.addPanel(identifier, true);
            }

            if (typeof fn == 'function')
                fn.call(global, this.getPanel(this._identifierToIndex(identifier)));
        },

        // Stages API
        //
        // in constructor
        // this._stages = {};
        //
        _stages: null,
        _stageDic: null,
        _getStageDic: function _getStageDic() {
            this._stageDic || (this._stageDic = {});
            return this._stageDic;
        },
        _stringToStageObj: function _stringToStageObj(str) {
            var stageObj;
            if ('string' === typeof stage)
                // @todo : check to secure the use of eval or remove it
                eval("stageObj = this._stages." + stage);
            return stageObj;
        },
        createStage: function createStage(name, into) {
            var re = /^[a-zA-Z]*$/,
                names = name.split('.'),
                ns = 'this._stages';

            names.forEach(function (item) {
                if (re.test(item)) {
                    ns += '.' + item;
                    eval(ns + " || (" + ns + " = {})");
                } else {
                    throw "Invalid name or namespace for a stage name";
                }
            }, this);
        },
        addToStage: function addToStage(panel, stage, position) {
            var stageObj, index = parseInt(position, 10);
            stageObj = this._stringToStageObj(stage);

            if (stageObj[index])
                throw "Invalid position for panel";
                
            stageObj[index] = panel;
            // this.getPanel(panel).setStage(stage); ???
            this._getStageDic()[panel] = stage;

        },
        removeFromStage: function removeFromStage(panel) {
            var stageObj, index = parseInt(position, 10);
            stageObj = this._stringToStageObj(this._getStageDic()[panel]);
                
            stageObj[index] = null;
            delete stageObj[index];
            // panel.setStage(null); ???
        }
    });
    
})(oo || {});