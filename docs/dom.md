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

  _- static createElement()_

  Returns a newly created dom node



  _- constructor()_

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



  _- getTranslations()_

  Get the current translation values of the current dom object

  You may give a boolean value as argument for this method. if true, the value will be read from the dom and not from the cache



  _- setTranslations()_

  Defines values for translation on the two axis : x value as first argument, y value as second argument; the third argument is the unit if none is provide it will use 'px';



  _- getWebkitTransform()_

  Get the transform matrix applied to the current dom object

  You may give a boolean value as argument for this method. if true, the value will be read from the dom and not from the cache

  You will most probably not need to use this method 



  _- setWebkitTransform()_

  Set a transform matrix to the current dom object.
  You will most probably not need to use this method 



  _- getTranslateX (unit, [noCache])_

  Get the value of the translation on the X axis, the second parameter determine if it could come from cache



  _- getTranslateY (unit, noCache)_

  Get the value of the translation on the Y axis, the second parameter determine if it could come from cache



  _- setTranslateX (val)_

  Set the value of the translation on the X axis



  _- setTranslateY (val)_

  Set the value of the translation on the Y axis



  _- setDomObject (domNode)_

  Setter for internal dom object (may not be used directly)
  A native dom object is expected as single argument



  _- getDomObject ()_

  Getter for internal dom object
  Returns a native dom object



  _- find (selector, [booleanVal])_

  Find a child element of the current node according to the given selector
  If a falsy value is given as second argument it will return a oo.view.Dom Object



  _- findAll (selector, returnDom)_

  Find all children elements of the current node according to the given selector
  If a falsy value is given as second argument it will return an array of oo.view.Dom Objects




  _- function parent()_

  Return the parent node of the current one



  _- children()_

  Return the children nodes of the current one



  _- findParentByCls (cls)_

  Return the first parent node of the current one that has the cls given as argument



  _- appendDomNode (domNode)_

  append a node to the current node's children list
  a native dom object is expected as arguemnt



  _- prependDomNode (domNode)_

  prepend a node on top to the current node's children list
  a native dom object is expected as arguemnt



  _- appendChild (node)_

  append a node to the current node children list
  can be a native DOMObject or a oo.Dom object



  _- prependChild (node)_

  prepend a node on top to the current node children list
  can be a native DOMObject or a oo.Dom object



  _- appendHtml (html)_

  append html (given as string) to the current node innerHTML property



  _- html (htmlString)_

  replace the current node innerHTML property by the htmlString argument (given as string)



  _- removeChild(node)_

  remove the child node `node` (given as native node object)



  _- clear ()_

  clear html content of a node (this method DO NOT unregister listener or other object linked to the dom)



  _- stopAnimation ()_

  stop animation by setting the duration to 0



  _- translateTo (coord, duration, listener, timingFunction)_

  apply a animated translation on an object
  you may define a set of duration, animation end callback, for one shot

  as first argument an object containning 'x', and 'y' integer properties is expected
  the 'duration' argument must be an int in ms
  the 'listener' argument will be used as a one shot callback (only for this transition)
  the 'timmingFunction' argument is the classic string to define the timming function as in CSS



  _- setId(id)_

  set the id property of the node



  _- getId(id)_

  get the id property of the node


