var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom,
        Touch = oo.core.Touch,
        ns = oo.getNS('oo.view');
    
    var List = ns.List = my.Class(oo.view.Element, {
        STATIC: {
            EVT_RENDER: 'render',
            EVT_ITEM_PRESSED: 'item-pressed',
            EVT_ITEM_RELEASED: 'item-released'
        },
        _structTpl: '<ul>{{#data}}<li class="oo-list-item item-{{key}}">{{tpl}}</li>{{/data}}</ul>',
        _touchedItem: null,
        constructor: function constructor(conf) {
            List.Super.call(this, conf);

            this._initEvents();
        },
        setTemplate : function setTemplate(tpl){
            this._tpl = this._structTpl.replace('{{tpl}}', tpl || '');
        },
        _initEvents: function () {
             
            function checkTarget (target) {
                var t = new Dom(target);
                var itemId;
                if (t.classList.hasClass('oo-list-item')) {
                    itemId = t.getDomObject().className.match(/item-(.*)/)[1] || t.getId();
                } else {
                    var altTarget = t.findParentByCls('oo-list-item');
                    if (altTarget) {
                        t = altTarget;
                        itemId = t.getDomObject().className.match(/item-(.*)/)[1] || t.getId();
                    }
                }
                 
                if (itemId) {
                    return {id: itemId, dom: t};
                }
                 
                return false;
            }
             
            var that = this;
            var check;
            this.getDomObject().addEventListener(Touch.EVENT_START, function (e) {
                this._touchedItem = e.target;
                check = checkTarget(e.target);
                if (false !== check) {
                    check.dom.classList.addClass('active');
                     
                    Events.triggerEvent(List.EVT_ITEM_PRESSED, that, [check.dom, check.id]);
                }
            }, false);
            this.getDomObject().addEventListener(Touch.EVENT_MOVE, function (e) {
                if (this._touchedItem) {
                    this._touchedItem = null;
                    that._dom.find('.active').classList.removeClass('active');            
                }
            }, false);        
            this.getDomObject().addEventListener(Touch.EVENT_END, function (e) {
                check = checkTarget(e.target);
                check.dom.classList.removeClass('active');            
                if (false !== check && this._touchedItem == e.target) {
                    Events.triggerEvent(List.EVT_ITEM_RELEASED, that, [check.dom, check.id]);
                }
            }, false);
        },
        prepareData: function prepareData(data) {
            return {'data': data};
        }
    });
    
    oo.view.Element.register(List, 'list');

    return oo;
    
})(oo || {});