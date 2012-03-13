(function (oo) {

    var v = oo.createPanel({
        id: 'list-categ',
        init: function init() {
            this.setTemplate('<div class="monpanel">&nbsp;</div>');

            var l = oo.createElement('list', {target: '.monpanel', model: model, template: '<h2>{{label}}</h2>'});
            l.setId('categories');

            this.addEl(l);
        },
        onEnabled: function onEnabled() {

        }
    });

    oo.getViewport().register(v);



    var v2 = oo.createPanel({
        id: 'list-article',
        init: function init() {
            this.setTemplate('<div class="monpanel-articles">&nbsp;</div>');
        },
        onEnabled: function onEnabled() {
            var l = oo.createElement('list', {target: '.monpanel-articles', model: articlesModel, template: '<div class="square" style="background: url(\'{{pic}}\')"><div class="overlay"></div></div>'});
            l.setId('articles');

            this.addEl(l);
        }
    });

    oo.getViewport().register(v2);



    var v3 = oo.createPanel({
        id: 'article',
        init: function init() {
            this.setTemplate('<div class="article"><img class="cover" src="assets/facebook-cms.jpg"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu turpis sapien. Quisque suscipit dolor ut urna porttitor eu faucibus est pharetra. Donec vel purus eu nisl sodales euismod. Nunc interdum pellentesque aliquet. Aenean libero enim, eleifend a tincidunt vel, eleifend sed sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac lorem sit amet erat vestibulum congue ac ac elit. Sed id erat ante.</p><p>Morbi quis lacus et velit pellentesque hendrerit. Nunc mattis lorem eget tellus commodo non placerat mi imperdiet. Fusce quam ligula, bibendum ac pellentesque id, vestibulum in lorem. Quisque auctor pretium neque et sagittis. Nulla varius, elit in ultricies facilisis, nibh lacus scelerisque eros, eu ultrices augue tellus imperdiet nulla. Nullam laoreet nisl vel tellus facilisis quis feugiat eros fermentum. Suspendisse accumsan varius lectus sed gravida.</p></div>');
        },
        onEnabled: function onEnabled() {

        }
    });

    oo.getViewport().register(v3);

})(oo);