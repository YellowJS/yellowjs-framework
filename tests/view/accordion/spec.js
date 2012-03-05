describe("oopopin.js", function() {
    var acs = Array.prototype.splice.call(document.querySelectorAll('div.accordion'),0);

    acs.forEach(function(item){
        var ac = oo.createElement('accordion', { target:item});
    });
   // var ac = oo.createElement('accordion', { target:"div.accordion"});

});