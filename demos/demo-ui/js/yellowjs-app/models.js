oo.createModel({
    "name" : "features",
    "provider" : {
        type: "memory"
    }
});

oo.getModel("features").setData([{
    "name": "Buttons",
    "slug": "buttons"
}, {
    "name": "Accordion",
    "slug": "accordion"
}, {
    "name": "Touch",
    "slug": "touch"
}, {
    "name": "Scroll",
    "slug": "scroll"
}]);

oo.getModel("features").save();