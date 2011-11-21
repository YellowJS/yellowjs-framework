var oo = (function (oo) {

    // shorthand
    var Dom = oo.Dom, Touch = oo.Touch, utils = oo.utils, Events = oo.Events;
    
    var Viewport = function (root) {
        root = root || 'body';
        
        this._root = new Dom(root);
        
        // give access to classList of the root node
        this.classList = this._root.classList;
        
        this._panels = [];
        this._panelsDic = [];
        this._enabledPanels = [];        
        this._focusedStack = [];
    };
    
    Viewport.ANIM_RTL = 'rtl';
    Viewport.ANIM_LTR = 'ltr';
    Viewport.NO_ANIM = 'none';
    // Viewport.ANIM_RTL_[...] = '...';    
    
    Viewport.ANIM_DURATION = 500;
    
    var p = Viewport.prototype;
    
    /**
     * return true if the panel has already been added
     * @param panel {String} identifier as string or index
     **/
    p.hasPanel = function hasPanel (panel) {
        return -1 != this._panelsDic.indexOf(panel) ? true : false;
    };
    
    /**
     * add a panel to the viewport
     * @param view {string} a template string
     * @param identifier {string} a name that will be used as reference to the panel
     * @autoShow {bool} will render/show the panel directly after adding it
     * @autoRender {bool|string} will render the panel directly after adding - if the autoShow param is set to true then it is used as animDirection
     * @animDirection {string} define an animation (use constant)
     **/
    p.addPanel = function addPanel (view, identifier, autoShow, autoRender, animDirection) {
        
        var p = new Dom.createElement('div');
        p.getDomObject().id = identifier;
        p.classList.addClass('oo-panel');
        
        var template = view;
        var dataTpl = {};
        if (typeof view == 'object' && view.template) {
            template = view.template;
            dataTpl = view.data || {};
        }
        p.setTemplate (template);
        
        this._panels.push(p);
        this._panelsDic.push(identifier);
        
        if (autoShow) {
            animDirection = autoRender || animDirection;
            p.render(dataTpl);
            this.showPanel(identifier, animDirection);
        } else {
            if (autoRender) {
                p.render(dataTpl);
            }
        }
    };
    
    p._identifierToIndex = function _identifierToIndex (identifier) {
        var index = identifier;
        if (typeof index == 'string') {
            index = this._panelsDic.indexOf(index);
        }
        return index;
    };

    p._indexToIdentifier = function _identifierToIndex (index) {
        return index = this._panelsDic[index];
    };

    p._enablePanel = function _enablePanel (identifier) {
        var index = this._identifierToIndex(identifier);
                
        this._root.appendChild(this._panels[index]);
        
        this._enabledPanels.push(index);
        
        // hook to initialize view components such as vscroll or carousel
        // @todo : change the sender, should not be sent by the panel but the visible API is nicer this way    
        Events.triggerEvent('onEnablePanel', this._panels[index], [{identifier: this._indexToIdentifier(index), panel: this._panels[index]}]);
    };
    
    /**
     *
     **/
    p.getFocusedPanel = function getFocusedPanel (getIndex) {
        index = this._focusedStack[this._focusedStack.length - 1];
        if (getIndex) {
            return undefined !== index ? index : false;
        } else {
            return this.getPanel(index);
        }
    }
    
    /**
     * return the Panel as a oo.Dom object 
     **/
    p.getPanel = function getPanel (identifier) {
        return this._panels[this._identifierToIndex(identifier)] || false;
    };
    
    p.panelIsEnable = function panelIsEnable (identifier) {
        return (-1 != this._enabledPanels.indexOf(this._identifierToIndex(identifier)) ? true : false);
    };
    
    p.removePanel = function removePanel (panel) {
        
        var index = this._identifierToIndex(panel);
        
        // event ?
        this._panels[index].destroy();
        
        this._panels.slice(index, 1);
        this._panelsDic.slice(index, 1);        
    };
    
    /**
     * show a panel with a optional animation
     * @param {string|int} the panel string identifier or index
     * @param {direction} Right To Left or Left To Right or no anim (use constant)
     **/
    p.showPanel = function showPanel (panel, direction) {
        
        var index = this._identifierToIndex(panel);

        direction = direction || Viewport.ANIM_RTL;

        var anim_duration = 0;
        if (direction !== Viewport.NO_ANIM) {
            // prepare transition
            var translateDist = this._root.getWidth() * (direction == Viewport.ANIM_RTL ? 1 : -1);
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
        Events.triggerEvent('onShowPanel', this._panels[index], [{identifier: this._indexToIdentifier(index), panel: this._panels[index]}]);
        
    };
    
    p.hidePanel = function hidePanel (panel, direction, destroy) {
        var index = this._identifierToIndex(panel);

        direction = direction || Viewport.ANIM_RTL;
        
        var anim_duration = 0;
        if (direction !== Viewport.NO_ANIM) {
            anim_duration = Viewport.ANIM_DURATION;
        }
        
        // transition
        var translateDist = this._root.getWidth() * (direction == Viewport.ANIM_RTL ? -1 : 1);
        // this.getPanel(index).setZIndex(3, '');
        var that = this;
        this.getPanel(index).translateTo({x:translateDist}, Viewport.ANIM_DURATION, function () {
            // that.getPanel(index).setDisplay('none');
            that.getPanel(index).stopAnimation();
        });
        
        if (index == this.getFocusedPanel(true)) {
            this._focusedStack.pop();
        }
        
        Events.triggerEvent('onHidePanel', this, [{identifier: this._indexToIdentifier(index), panel: this._panels[index]}]);        
    };
    
    /**
     * show the newPanel and hide the oldPanel
     * this method usualy takes three parameter, you may pass only two (first as the new Panel, and second
     * as the direction of the animation) the current panel will be auto hidden
     * @param oldPanel the panel to hide
     * @param newPanel the panel to show
     * @param define an animation for both hide and show transitions (use constant)
     **/
    p.switchPanel = function switchPanel (oldPanel, newPanel, direction) {
        var dir, oldP, newP;
        
        if (typeof arguments[1] == 'string' || 1 == arguments.length) {
            dir = newPanel;
            newP = oldPanel;
            oldP = this.getFocusedPanel(true)
        } else {
            oldP = oldPanel;
            newP = newPanel;
            dir = direction;
        }
        
        this.showPanel(newP, dir);

        if (false !== oldP) {
            this.hidePanel(oldP, dir);
        }

    };
    
    oo.Viewport = Viewport;
    return oo;
})(oo || {});