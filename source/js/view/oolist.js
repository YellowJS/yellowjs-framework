var oo = (function (oo) {

    // shorthand
    var Dom = oo.View.Dom, Touch = oo.Touch, utils = oo.core.utils, Events = oo.Events, Store = oo.Store;
    
    var List = my.Class({
        STATIC : {
            EVT_RENDER : 'render',
            EVT_ITEM_PRESSED : 'item-pressed',
            EVT_ITEM_RELEASED : 'item-released'
        },
        constructor: function constructor(store, tpl, selector) {
            
            this._data = null;

            this._touchedItem = null;

            this._store = store;
            var that = this;
            Events.addListener(Store.EVT_REFRESH, function () { that._refreshList.apply(that, arguments); }, this._store);

            this.setTemplate(tpl || '<li class="oo-list-item item-{{id}}">{{.}}</li>');

            if (selector) {
                this._dom = new Dom(selector);
            } else {
                this._dom = Dom.creataElement('ul');
            }

            this._initEvents();

            this._refreshList();
        },
        _initEvents : function _initEvents(){
            
            function checkTarget (target) {
                var t = new Dom(target);
                var itemId;
                if (t.classList.hasClass('oo-list-item')) {
                    itemId = t.getDomObject().className.match(/item-([0-9]*)/)[1];
                } else {
                    var altTarget = t.findParentByCls('oo-list-item');
                    if (altTarget) {
                        t = altTarget;
                        itemId = t.getDomObject().className.match(/item-([0-9]*)/)[1];
                    }
                }

                if (itemId) {
                    return {id: itemId, dom: t};
                }

                return false;
            }

            var that = this;
            var check;
            this._dom.getDomObject().addEventListener(Touch.EVENT_START, function (e) {
                this._touchedItem = e.target;
                check = checkTarget(e.target);
                if (false !== check) {
                    check.dom.classList.addClass('active');

                    Events.triggerEvent(List.EVT_ITEM_PRESSED, that, [check.dom, check.id]);
                }
            }, false);
            this._dom.getDomObject().addEventListener(Touch.EVENT_MOVE, function (e) {
                if (this._touchedItem) {
                    this._touchedItem = null;
                    that._dom.find('.active').classList.removeClass('active');            
                }
            }, false);        
            this._dom.getDomObject().addEventListener(Touch.EVENT_END, function (e) {
                check = checkTarget(e.target);
                check.dom.classList.removeClass('active');            
                if (false !== check && this._touchedItem == e.target) {
                    Events.triggerEvent(List.EVT_ITEM_RELEASED, that, [check.dom, check.id]);
                }
            }, false);
        },
        getDom : function getDom() {
            return this._dom;
        },
        _refreshList : function _refreshList(){
            this._fetchStoreData();
            this._dom.clear();
            this._dom.render(this._data, this._template, true);
            Events.triggerEvent(List.EVT_RENDER, this);
        },
        _prepareData : function _prepareData(data) {
            return {items: data};
        },
        setData : function setData(data) {
            this._data = this._prepareData(data);
        },
        _fetchStoreData : function _fetchStoreData() {
            this.setData(this._store.getData());
        },
        setTemplate : function setTemplate(tpl){
            this._template = this._prepareTpl(tpl);
        },
        _prepareTpl : function _prepareTpl(tpl){
            return ['{{#items}}', tpl, '{{/items}}'].join('');
        }
    });
    
    var exports = utils.getNS('oo.View');
    exports.List = List;
    
    return oo;
    
})(oo || {});