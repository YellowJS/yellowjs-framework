Core
====

  Class: Core  
  Namespace: -  
  Extends: -  
  Mixins: -  


Description
-----------

  This class can’t be instanciate. But it exists a unique instance you can use with the variable “oo”.

  There is a lot of shorthand / utility / sugar methods attached to this object. you can see below the details for each on of these methods


Methods
-------

  * define()

  When you will start your application, you could define some configuration. For that, use the “define” function. Below, the list of attributes that could be defined :

  \- templateEngine  
      When templateEngine is defined, the “_setTemplateEngine” function of “oo.core” is called. This function create a new instance of your “templateEngine” class then store your template engine in the Element class. For more information see Template class.

      Exemple of usage: 
      oo.define({templateEngine : “mustache”});

    
  \- scroll  
      The scroll library to use in your project. By default : “iscroll”.

  \- viewportSelector  
      a css selector in wich the viewport will be rendered - the default value is “body”

  \- pushState  
      should the router use the pushState API - by default, the value is false


  * getConfig()

  get regitered value of the global config.

  usage:
    
    oo.getConfig('config_name_as_string');



  * log() / warn()

  use these method to write logs or warnings in the developer’s console, these metod will “silently fail” if there is no console in your environnement.

  We may provide a way to output logs and warns in a “remote console” in order to make the debug on real device easier.



  * Class()

  this method is made to create class. It can takes up to three parameters
  \- if there is one parameter : it should be a object that contains the methods and members of the class  

  \- if there is two parameters the second parameter is an object that contains the methods and members of the class, the first paramter should be the parent class  

  \- if there is three parameters the first paramter is still the parent class, the third parameter is a class or an object that will be mixed in the class  

  in all of these case if the object that represents the class, the “constructor” keyword used as key in the object will be used as the class constructor.

  Exemple of usage: 
    
    var MyClass = oo.Class (MyParent, {
      constructor: function constructor () {
         // ...
      },
      method: function method () {
         // ...
      }
    });

    var monObj = new MyClass();
    monObj.method();



  * getNS()

  returns a object representing the namspace matching the string parameter given as parameter



  * createDelegate()

  creates a function and bind it a scope



  * emptyFn()

  return an empty function (used for callback default value)



  * override()

  takes two objects as parameter. The first one will be used as a is and will be overriden by the second one. in fact value form the second object will overrides the one from the first, and they do not exists in the firt object will be created. This method is mainly used to manage config with mandatory default value. 



  * bootstrap()

  did my app ready is? give as parameter a callback function that will automatically call it at the right moment


  * dom(selector)

  return a oo.view.Dom object (a dom node wrapped into an helper)


  * ajax()

  perform a ajax call



  * createController()

  _Note_: oo.createController() will be deprecate soon and will be replaced with oo.createControllerClass()

  This function takes up to 2 parameters:

  \- an optional identifier that will be used when registering the controller class into the router - if none provided, it will not be registered into the router  
  \- the body of the class itself that consist of a litteral object containning only function that will be added as controller’s actions.

  it returns a function (used as class)

  Exemple of usage:

    var MyControllerClass = oo.createController("MyController", {
      indexAction : function indexAction() {
        // ...
      },
      anotherAction : function anotherAction() {
        // ...
      }
    });

    _Note_: be warn that there is naming convention that you must strictly follow in order to make the routing process work properly. you can check these conventions in the Router class documentation



  * generateId()

  generate a uniq id



  * getRouter()

  get the singleton instance of the router



  * serialize()

  transform a litteral objcet into an url complient list of parameters (string)



  * isArray()

  test wether the given argument is an array


  * createModel()

  create and register an oo.data.Model. Uses the litteral object given as argument to configure the resulting model (will use it as arguement for the oo.data.Model constructor).

  for detailed documentation about the configuration option of an oo.data.Model see the specific class documentation


  * getModel()

  anywhere in your application retrieve a previously registered model via this helper method. give it as single argument the name property of the desired model



  * getViewport()

  returns the viewport instance 



  * createPanelClass()



  * createElement()



