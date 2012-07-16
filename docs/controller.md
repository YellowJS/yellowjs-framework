Controller
==========
  
  Class: Controller  
  Namespace: oo.router  
  Extends: -  
  Mixins: -  


Description
-----------

  Controller is a class that contains actions. Application are generally organized by “screen” : one action method for  one screen. So this is the place where interactions between events from UI and business logic take place.

  This class should not be instantiate directly, but each controller of your application should inherit from this class and should be registered/attached to the router singleton instance

  To do such things you may use the “oo.createController()” to easily create a controller and register it.

  In order to make your controller usable (make you app aware of your controller) you have to register it in the router (cf Router class)

    // create controller
    // note : by usgin this method the controller is automatically registered
    //
    oo.createControllerClass('IndexController', {
      indexAction : function indexAction(){
        // do your stuff ...
      }
    });  

Methods
-------

  * getViewport()

  returns an instance (singleton) of the viewport


  * getPanel(identifier)

  returns a panel instance according to the indentifier given as argument


  * panelIsEnabled(identifier)

  returns true or false if the panel (according to the indentifier given as argument) has already been anabled