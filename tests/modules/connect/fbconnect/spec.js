describe("module ooconnect.js", function() {

    //create the FBConnect
    yellowjs.createConnect({
        type:'facebook',
        appId: "344134445663948"
    });
    
    //login
    document.querySelector('#fb-login').addEventListener('click',function(e){
        e.preventDefault();
        yellowjs.getConnect().login(function(response){
            console.log('callback executed');
            console.log(response);
        });
    },false);

    //logout
    document.querySelector('#fb-logout').addEventListener('click',function(e){
        e.preventDefault();
        yellowjs.getConnect().logout(function(response){
            console.log('callback executed');
            console.log(response);
        });
    },false);
    
    //getLoginStatus
    document.querySelector('#fb-logstatus').addEventListener('click',function(e){
        e.preventDefault();
        yellowjs.getConnect().getLoginStatus(function(response){
            console.log('callback executed');
            console.log(response);
        });
    },false);

    document.querySelector('#fb-getuser').addEventListener('click',function(e){
        e.preventDefault();
        yellowjs.getConnect().getUser(function(response){
            console.log('callback executed');
            console.log(response);
        });
    },false);
});