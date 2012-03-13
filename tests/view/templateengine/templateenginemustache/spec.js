describe("ootemplateenginemustache.js", function() {
    oo.define({
        templateEngine : 'mustache'
    });
 
    describe('render',function(){
     var tpl = '{{#datas}}<li>{{nickname}}</li>{{/datas}}';
      var predatas = (new oo.data.FakeProvider({'name' : "test"}))._data;
 
      var datas = {
        'datas' : predatas
      };
 
      var templateEngine = new oo.view.templateengine.TemplateEngineMustache();
 
      var content = templateEngine.render(tpl, datas);
 
      document.querySelector('#target').innerHTML = content;
      var items = document.querySelectorAll('#target li');
 
      it('content return by render function must be a string', function(){
         expect(typeof content === 'string').toBeTruthy();
      });
 
      it('list items length must be equal to 2', function(){
         expect(items.length).toEqual(10);
      });
 
      it('first item content must be value1', function(){
        expect(items[0].innerHTML).toEqual('Claire_So');
      });
 
      it('second item content must be value2', function(){
        expect(items[1].innerHTML).toEqual('FreakDev');
      });
 
    });
});