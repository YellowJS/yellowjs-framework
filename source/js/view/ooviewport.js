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
            ANIM_RTL : '1',
            ANIM_LTR : '2',
            ANIM_UP : '3',
            ANIM_DOWN : '4',
            ANIM_SIBLING : '5',
            NO_ANIM : 'none',
            ANIM_DURATION : 350,
            APPEND_TO_STAGE: 'append',
            PREPEND_TO_STAGE: 'prepend'
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
            // default stage 'main'
            this._stages = {main: {}};
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
                dir = newPanel;
                newP = oldPanel;
                oldP = this._indexToIdentifier(this.getFocusedPanel(true));
            } else {
                oldP = oldPanel;
                newP = newPanel;
                dir = direction;
            }
                
            // uses stages tree to determine which animation to use
            if (!dir) {
                var oldPStage = this._getStageDic()[oldP],
                    newPStage = this._getStageDic()[newP];
                if (oldPStage == newPStage) {
                    // for siblings panels
                    var stageNS = this._stringToStageObj(oldPStage);
                    if (stageNS.panels.indexOf(oldP) > stageNS.panels.indexOf(newP)) {
                        dir = Viewport.ANIM_LTR;
                    } else {
                        dir = Viewport.ANIM_RTL;
                    }
                }
                else {
                    // for non siblings panels
                    // implement UP/DOWN transition ?
                    dir = Viewport.NO_ANIM;
                }
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
        register: function register(id, p, stage, pos) {
            this._panelClasses[id] = p;
            stage || (stage = "main");

            var conf = oo.override({stage:"main", pos:Viewport.APPEND_TO_STAGE}, {stage:stage, pos:pos});

            if (!this.addToStage(id, conf.stage, conf.pos))
                throw "The panel has not been added to a stage - it has already been added in another stage";
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

        // Stages API
        //
        // in constructor
        // this._stages = {};
        //
        // STATIC: {
        //   APPEND_TO_STAGE: 'append',
        //   PREPEND_TO_STAGE: 'prepend'
        // }
        //
        _stages: null,
        _stageDic: null,
        _getStageDic: function _getStageDic() {
            this._stageDic || (this._stageDic = {});
            return this._stageDic;
        },
        _stringToStageObj: function _stringToStageObj(str) {
            var stageObj;
            if ('string' === typeof str)
                // @todo : check to secure the use of eval or remove it
                eval("stageObj = this._stages." + str);
            return stageObj;
        },
        getStage: function getStage(stage) {
            return this._stringToStageObj(stage).panels || [];
        },
        createStage: function createStage(name, into) {
            var re = /^[a-zA-Z]*$/,
                names = name.split('.'),
                ns = 'this._stages';

            names.forEach(function (item) {
                if (re.test(item) && item != 'panels') {
                    ns += '.' + item;
                    eval(ns + " || (" + ns + " = {})");
                } else {
                    throw "Invalid name or namespace for a stage name";
                }
            }, this);

            return eval(ns);
        },
        removeStage: function removeStage(stage) {
            // if remove a nstage containnings children stages, children are not removed properly
            var stageObj, lastIndex = stage.lastIndexOf('.'), lastPart, parentStage;
                if (-1 !== lastIndex) {
                    lastPart = stage.substr(lastIndex + 1);
                    parentStage = stage.substr(0, lastIndex);
                    stageObj = this._stringToStageObj(parentStage);
                } else {
                    lastPart = stage;
                    stageObj = this._stages;
                }

            // console.log(lastIndex, lastPart, parentStage);

            stageObj[lastPart] = null;
            delete stageObj[lastPart];
            // panel.setStage(null); ???
        },
        addToStage: function addToStage(panel, stage, position) {
            if (this._getStageDic()[panel])
                return false;

            var stageObj, index = parseInt(position, 10);
            stageObj = this._stringToStageObj(stage);
            if (!stageObj)
                stageObj = this.createStage(stage);


            position = position || Viewport.APPEND_TO_STAGE;

            if (!stageObj.panels) {
                stageObj.panels = [];
            }

            posToInsert = position == Viewport.APPEND_TO_STAGE ? stageObj.panels.length : position == Viewport.PREPEND_TO_STAGE ? 0 : null;

            if (null === posToInsert)
                stageObj.panels[parseInt(position, 10)] = panel;
            else
                stageObj.panels.splice(posToInsert, 0, panel);

            // this.getPanel(panel).setStage(stage); ???
            this._getStageDic()[panel] = stage;

            return true;
        },
        removeFromStage: function removeFromStage(panel) {
            var stageObj;
            stageObj = this._stringToStageObj(this._getStageDic()[panel]);
                
            stageObj.panels.splice(stageObj.panels.indexOf(panel), 1);
            this._getStageDic()[panel] = null;
            delete this._getStageDic()[panel];
            // panel.setStage(null); ???
        }
    });
    
})(oo || {});