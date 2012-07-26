describe("module ooconnect.js", function() {

    //create a connect
    
    
    describe('getType',function(){
        it('must be facebook',function(){
            yellowjs.createConnect();
            expect(yellowjs.getConnect().getType()).toEqual('facebook');
        });
        it('must be local',function(){
            yellowjs.createConnect({type:"local"});
            expect(yellowjs.getConnect().getType()).toEqual('local');
        });
    });
});