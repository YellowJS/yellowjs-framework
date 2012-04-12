oo.createPanelClass({
    id:'home',
    init: function init () {
        this.setTemplate(document.querySelector('#tpl-standard').text);
        this.setData({title: "Home"});
    },
    onEnabled: function onEnabled () {
        
        var featuresModel = oo.getModel("features");

        var list = this.createElement('list', {
            el: "#home .content",
            model: featuresModel,
            template: "<ul class=\"list\">{{#loop}}<li data-id=\"{{slug}}\" class=\"item\"><div class=\"item-content\">{{name}}</div></li>{{/loop}}</ul>",
            listItemCls: 'item',
            listItemDataAttrib: 'data-id',
            identityField: 'slug'
        });

        list.addListener(oo.view.List.EVT_ITEM_RELEASED, function (dom, id, row) {
            oo.getRouter().load('/detail/feature/' + row.slug);
        });

        this.addListener(oo.view.Panel.ON_SHOW, function () {
            featuresModel.fetch();
        });

    }

}, {stage: "main"});


oo.createPanelClass({
    id:'buttons',
    init: function init () {
        this.setTemplate(document.querySelector('#tpl-buttons').text);
        this.setData({title: "Buttons"});
    },
    onEnabled: function onEnabled () {

        this.createElement('button', {
            el: "#buttons .btn-back",
            onrelease: function onrelease () {
                oo.getRouter().load('/index');
            }
        });

        this.findAll(".btn:not(.btn-back)").forEach(function (el) {
            this.createElement('button', {
                el: '#' + el.getId(),
                onrelease: function onrelease () {
                    console.log(this);
                    alert("Button " + this.getDomObject().getAttribute('data-name') + " pressed");
                }
            });
        }, this);
    }

}, {stage: "main"});


oo.createPanelClass({
    id:'accordion',
    init: function init () {
        this.setTemplate(document.querySelector('#tpl-accordion').text);
        this.setData({title: "Accordion"});
    },
    onEnabled: function onEnabled () {

        this.createElement('button', {
            el: "#accordion .btn-back",
            onrelease: function onrelease () {
                oo.getRouter().load('/index');
            }
        });

        this.createElement('accordion', {
            el: "#accordion #accordion"
        });
    }

}, {stage: "main"});


oo.createPanelClass({
    id:'touch',
    init: function init () {
        this.setTemplate(document.querySelector('#tpl-touch').text);
        this.setData({title: "Touch"});
    },
    onEnabled: function onEnabled () {

        this.createElement('button', {
            el: "#touch .btn-back",
            onrelease: function onrelease () {
                oo.getRouter().load('/index');
            }
        });

        function listener(e) {
            var node = document.querySelector("#touch .console");
            node.innerHTML = e.type + '<br />' + node.innerHTML;
        }

        var node = document.querySelector("#touch .touch-pad");
        
        node.addEventListener('swipeLeft', listener);
        node.addEventListener('swipeRight', listener);
        node.addEventListener('tap', listener);
        node.addEventListener('doubleTap', listener);
    }

}, {stage: "main"});


oo.createPanelClass({
    id:'scroll',
    init: function init () {
        this.setTemplate(document.querySelector('#tpl-scroll').text);
        this.setData({title: "Accordion"});
    },
    onEnabled: function onEnabled () {

        this.createElement('button', {
            el: "#scroll .btn-back",
            onrelease: function onrelease () {
                oo.getRouter().load('/index');
            }
        });

        var node = this.createElement('node', {
            el: "#scroll"
        });

        node.setScrollable({
            el: "#scroll .content"
        });
    }

}, {stage: "main"});


