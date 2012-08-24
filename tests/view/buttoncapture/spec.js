describe("oobutton.js", function() {
    
    describe("constructor",function(){
        it('wrong parameter',function(){
            expect(function(){
                var ooButton = oo.createElement('buttoncapture',{
                    el:"#button",
                    onrelease: function(){
                        alert('ok');
                    }
                });
            }).toThrow();
        });
    });

    var ooButton = oo.createElement('buttoncapture',{
        el:"#button",
        onrelease: function onrelease(response){
            console.log(response);
            alert('ok');
        },
        source:"camera",
        destinationType:"FILE_URI"
    });

});