(function (oo) {

    // shorthand
    var Touch = oo.core.Touch;
    
    var List = oo.getNS('oo.view').List = oo.Class(oo.view.ModelElement, {
        STATIC: {
            EVT_ITEM_PRESSED: 'item-pressed',
            EVT_ITEM_RELEASED: 'item-released'
        },
        _structTpl: '',
        _touchedItem: null,
        _noStructure: true,
        _identityField: '',
        _listItemCls: '',
        _listItemDataAttrib: '',
        constructor: function constructor(conf) {
            var defaultConf = {
                noStructure: true,
                structure: '<ul>{{#data}}<li data-id="{{key}}" class="oo-list-item">{{tpl}}</li>{{/data}}</ul>',
                identityField: 'key',
                listItemCls: 'flavius-list-item',
                listItemDataAttrib: 'data-list-item-id'
            };

            conf = oo.override(defaultConf, conf);

            this._noStructure = !!conf.noStructure;
            if (!this._noStructure)
                this._setStructTpl(conf.structure);

            this._identityField = conf.identityField;
            this._listItemCls = conf.listItemCls;
            this._listItemDataAttrib = conf.listItemDataAttrib;


            List.Super.call(this, conf);

            if(conf.scrollable){
                this.setScrollable(conf.scrollable);
            }
        },
        setTemplate : function setTemplate(tpl){

            if (!this._noStructure)
                this._tpl = this._genTplWithStructure(tpl);
            else {
                var testDiv = oo.view.Dom.createElement('div');
                testDiv.html(tpl);
                if (testDiv.children().length !== 1)
                    throw "Invalid template - the template must have a single root node";
                
                testDiv = null;
                this._tpl = '{{#data}}' + tpl + '{{/data}}';
            }
                

        },
        _initEvents: function _initEvents() {
             
            var that = this,
                check;

            function checkTarget (target) {
                target = (Node.TEXT_NODE === target.nodeType) ? target.parentNode : target;
                var t = new oo.view.Dom(target);
                var itemId;
                if (!t.classList.hasClass(this._listItemCls)) {
                    var altTarget = t.findParentByCls(that._listItemCls);
                    if (altTarget) {
                        t = altTarget;
                    }
                }
                 
                itemId = t.getDomObject().getAttribute(that._listItemDataAttrib) || t.getId();

                if (itemId) {
                    return {id: itemId, dom: t, row: (itemId ? that.getModel().getBy(that._identityField, itemId) : null)};
                }
                 
                return false;
            }
             
            this.getDomObject().addEventListener(Touch.EVENT_START, function (e) {

                this._touchedItem = e.target;
                check = checkTarget(e.target);
                if (false !== check) {
                    check.dom.classList.addClass('active');
                     
                    that.triggerEvent(List.EVT_ITEM_PRESSED, [check.dom, check.id, check.row]);
                }
            }, false);
            this.getDomObject().addEventListener(Touch.EVENT_MOVE, function (e) {
                if (this._touchedItem) {
                    this._touchedItem = null;
                    var active = that.find('.active');
                    if (null !== active)
                        active.classList.removeClass('active');
                }
            }, false);
            this.getDomObject().addEventListener(Touch.EVENT_END, function (e) {
                check = checkTarget(e.target);
                if (false !== check && this._touchedItem == e.target) {
                    check.dom.classList.removeClass('active');
                    that.triggerEvent(List.EVT_ITEM_RELEASED, [check.dom, check.id, check.row]);
                }
            }, false);
        },
        prepareData: function prepareData(data) {
            return {'data': data};
        },
        renderTo: function renderTo(target, data, tpl) {
            List.Super.prototype.renderTo.call(this, target, data, tpl);

            var datas = this.getModel().getData();
            if (datas.length) {
                this.children().forEach(function (item, index) {
                    var d = new oo.view.Dom(item);
                    d.classList.addClass(this._listItemCls);
                    d.getDomObject().setAttribute(this._listItemDataAttrib, datas[index][this._identityField]);
                }, this);
            }

            this._initEvents();
        },


        // deprecated
        _genTplWithStructure: function _genTplWithStructure(tpl) {
            return this._structTpl.replace('{{tpl}}', tpl || '');
        },
        _setStructTpl: function _setStructTpl(tpl){
            
            if(!tpl) {
                throw Error("Template must be declared");
            }

            this._structTpl = tpl;
        }
        
    });
    
    oo.view.Element.register(List, 'list');
    
})(oo || {});