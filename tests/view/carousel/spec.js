describe("oocarousel.js", function() {
    
    describe('items must be instance of panel', function(){
        it('should return error', function(){
            expect(function () { var carousel = new oo.view.Carousel('#carousel', false, [{id:1, title:"page1"}]); }).toThrow('Items must be instance of Panel Class');
        });
    });

    describe('...', function(){
        var tpl = '<div>panel</div>';
        



        /*var datas = [
            {
                id : 1,
                title : 'article 1'
            },
            {
                id : 2,
                title : 'article 2'
            }
        ];*/


        /*datas.forEach(function(item){
            var panel = oo.createPanel({
              id : item.id,
              init : function init(){
                    this.setTemplate(tpl);
              }
            });

            carouselItems.push( new panel() );

        });*/

        var carousel = new oo.view.Carousel('#carousel', false, carouselItems);


    });

});