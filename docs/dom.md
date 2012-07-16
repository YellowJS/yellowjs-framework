Dom
=====

  Class: Dom  
  Namespace: oo.view  
  Extends: -  
  Mixins: oo.core.mixins.Events


Description
-----------

  This class is a dom manipulation helper

  almost all its methods are accessors / modificators memthods to update values of several dom note attributes.


Events
------


Methods
-------

  * static createElement()

  Returns a newly created dom node



  * constructor()

  The constructor expect a native DOM object, or a css selector as string

  Example :

    // the d variable will contains an object on which properties will be accessible from the Dom class methods
    var d = new oo.view.Dom('div#monId');


  _ GENERATED FUNCTION _

  get and set prefixed method are automatically generated for all these property : 
  width , height , zIndex , display , top , right , bottom , left , opacity , webkitTransitionProperty , webkitTransitionTimingFunction , webkitTransitionDuration , webkitTransitionDelay

  all these generated method have the same signature and accept two arguments

  for the setters the first argument is the value (usually an integer), and the second is the unit

  ex : p.setDisplay (val, [unit])


  for the getters, the first and the second arguments are boolean. The first one determine if the returned value is an int without unit or a string containing the unit

  ex : p.getWidth ([unit, [noCache]])



  * getTranslations()

  Get the current translation values of the current dom object

  You may give a boolean value as argument for this method. if true, the value will be read from the dom and not from the cache



  * setTranslations()

  Defines values for translation on the two axis : x value as first argument, y value as second argument; the third argument is the unit if none is provide it will use 'px';



  * getWebkitTransform()

  Get the transform matrix applied to the current dom object

  You may give a boolean value as argument for this method. if true, the value will be read from the dom and not from the cache

  You will most probably not need to use this method 



  * setWebkitTransform()

  Set a transform matrix to the current dom object.
  You will most probably not need to use this method 



  * getTranslateX (unit, [noCache])

  Get the value of the translation on the X axis, the second parameter determine if it could come from cache



  * getTranslateY (unit, noCache)

  Get the value of the translation on the Y axis, the second parameter determine if it could come from cache



  * setTranslateX (val)

  Set the value of the translation on the X axis



  * setTranslateY (val)

  Set the value of the translation on the Y axis



  * setDomObject (domNode)

  Setter for internal dom object (may not be used directly)
  A native dom object is expected as single argument



  * getDomObject ()

  Getter for internal dom object
  Returns a native dom object



  * find (selector, [booleanVal])

  Find a child element of the current node according to the given selector
  If a falsy value is given as second argument it will return a oo.view.Dom Object



  * findAll (selector, returnDom)

  Find all children elements of the current node according to the given selector
  If a falsy value is given as second argument it will return an array of oo.view.Dom Objects




  * function parent()

  Return the parent node of the current one



  * children()

  Return the children nodes of the current one



  * findParentByCls (cls)

  Return the first parent node of the current one that has the cls given as argument



  * appendDomNode (domNode)

  append a node to the current node's children list
  a native dom object is expected as arguemnt



  * prependDomNode (domNode)

  prepend a node on top to the current node's children list
  a native dom object is expected as arguemnt



  * appendChild (node)

  append a node to the current node children list
  can be a native DOMObject or a oo.Dom object



  * prependChild (node)

  prepend a node on top to the current node children list
  can be a native DOMObject or a oo.Dom object



  * appendHtml (html)

  append html (given as string) to the current node innerHTML property



  * html (htmlString)

  replace the current node innerHTML property by the htmlString argument (given as string)



  * removeChild(node)

  remove the child node `node` (given as native node object)



  * clear ()

  clear html content of a node (this method DO NOT unregister listener or other object linked to the dom)



  * stopAnimation ()

  stop animation by setting the duration to 0



  * translateTo (coord, duration, listener, timingFunction)

  apply a animated translation on an object
  you may define a set of duration, animation end callback, for one shot

  as first argument an object containning 'x', and 'y' integer properties is expected
  the 'duration' argument must be an int in ms
  the 'listener' argument will be used as a one shot callback (only for this transition)
  the 'timmingFunction' argument is the classic string to define the timming function as in CSS



  * setId(id)

  set the id property of the node



  * getId(id)

  get the id property of the node


