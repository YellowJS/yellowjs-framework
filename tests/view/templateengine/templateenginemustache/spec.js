describe("ootemplateenginemustache.js", function() {
    oo.define({
        templateEngine : 'mustache'
    });

    describe('render',function(){
      var tpl = '<li>{{title}}</li>';
      var datas = (new oo.data.Fakeprovider({'name' : "test"}))._datas;
      var templateEngine = new oo.view.templateengine.TemplateEngineMustache();
      var content = templateEngine.render(datas, tpl);

      document.querySelector('#target').innerHTML = content;
      var items = document.querySelectorAll('#target li');

      it('content return by render function must be a string', function(){
         expect(typeof content === 'string').toBeTruthy();
      });

      it('list items length must be equal to 2', function(){
         expect(items.length).toEqual(2);
      });

      it('first item content must be value1', function(){
        expect(items[0].innerHTML).toEqual('value1');
      });

      it('second item content must be value2', function(){
        expect(items[1].innerHTML).toEqual('value2');
      });

    });
});