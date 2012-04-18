Router
======

  Class: Router  
  Namespace: oo.router  
  Extends: -  
  Mixins: -  


Description
-----------

  The Router class and the others classes in the “oo.router” namespace are designed to manage url changes: on hash change perform operations consequently. 
  The Router class uses a map to determine which function (on which object) to call when the url has a given pattern.

  The framework provides a singleton instance of Router class that you can retrieve with the getRouter() method of the oo object.

      var router = oo.getRouter();

  for more information please check the "Core" class documentation

  You only need to set up a bit configurations: regiter routes and controllers

  When all configurations are set, you can call the “init()” method, then the router will start listening at hash changes

  _Note_: with YellowJS, you may want to use the History API, but this last is not documented yet and is still experimental feature for now.

  Then, on hash change, the router will automatically find the first matching route in its referenced routes. Then according to the routes information, it will create an instance of the right controller and call the right method (the execution scope of the function will be its controller instance).

  Example: 

      query string change to : /index.html#/toggle-folder

  the router will browse its routes map, and find that route named “folder-toggle” match the given hash. It will create an instance of the controller class referenced under the index ‘folder’ in its controller list (those added by the method oo.router.Router.addControllers()) and then call the method toggleAction() of the controller instance.


Methods
-------

  _- addRoutes()_
  
  the parameters given to the "addRoutes" method should be an object containning named routes. Each route should be itself an object describing the triplet “expected url schema” / “controller” / “action” as shown in the example below :

  Example:

      var routesList = {
        'index': {
          url: '/index',
          controller: 'index',
          action: 'index'
        },
        'folder-toggle-route': {
          url: '/toggle-folder',
          controller: 'folder',
          action: 'toggle'
        }
      }



  _- addRoute()_
    
    Used to add one route

  Example:
  
    var router = oo.getRouter();
    router.addRoute(‘index’, { url : ‘/index’, controller : ‘index’, action: ‘index’});



  _- addController()_

  This method is used to register controllers and takes 2 parameters the first one is an identifier used to register the controller.

  Example:

    oo.getRouter().addController(
      'IndexController',
      {
        fooAction: function {
          // ...
        },
        barAction: function {
          // ...
        }
      }
    );
  
  You may want to register more than one controller at once, use the following method to do so:
  


  _- addControllers()_
  
  The controllersList is an object containing named controller classes (key will be used as controller name.

  Note: Any controller class should extend the oo.router.Controller class and identifier names must follow convention exposed below

  * The identifier (used to register a controller) must be suffixed by "Controller" and must start with an uppercase letter. 
  * An action method name must be suffixed by “Action” and must start with a lowercase letter.

  _Do / Don't_

    wrong : indexController, indexcontroller, index, IndexAction
    good : IndexController, indexAction

  This way if your url is : _/index.html#/toggle-folder_ and you have configured the router's routes with the configuration given as example previously, the router will find that your url match the route named "folder-toggle-route" it will then check if it has a controller registered with the "FolderController" identifier and invoke the action "toogleAction".


  _- back()_
  
  performs an history back


  _- url()_

  Takes a route name (string) as first parameter and a returns a string that can be used to load a particular url with the given set of parameters

  Exemple:

    oo.getRouter().url('folder-toggle', {foo: bar})
    // will return : /folder-toggle/foo/bar


  _- load()_

  Takes an url (string) as parameter and will update the browser url, it will automatically use the hash (with the # symbol) or not depending on what configuration has been set

  This will trigger a hash change and then a "navigation"

  _- init()_

  Method to call when all configuration has been set, the router starts to listen at the hash change after this method has been invoked.