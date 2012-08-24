describe("oofileinput.js", function() {


    var m = yellowjs.createModel({
        'name' : "post",
        'provider' : {
            type: 'filetransfer',
            url: 'http://labs.svn.octaveoctave.com/claire/gdfc/data/post.php',
            cacheProvider: 'local'
        }
    });


    var file = yellowjs.createElement('fileInput',{
        el:"#file",
        type:"picture",
        model : m,
        buttons:{
            "camera": {
                el : "#camera",
                quality:70,
                success:function success(){
                    console.log("success");
                },
                error:function error(){
                    console.log("error");
                }
            },
            "photolibrary": {
                el : "#library",
                destinationType:"FILE_URI",
                success:function success(){
                    console.log("success library");
                },
                error:function error(){
                    console.log("error library");
                }
            }
        }
    });

    console.log(file);
});