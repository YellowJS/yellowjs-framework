Provider
========

  Class: Provider
  Namespace: oo.data
  Extends: -  
  Mixins: -  


Description
-----------

  This class is used as an interface that all provider should implement to be considered as a valid provider for the model API.

  Providers implementation must be registered with the “register()” static method. Then you can access the class with the static method “get()” of the oo.data.Provider class.

  _Note_: method are documented but this not ensure implementation is conform, see the specific documentation of the particular provider.


Methods
-------

  * constructor()

  The constructor of this class takes a single object used as a configuration parameter. This object should have a property name.

  other properties can be required by particular implementation, but the Provider "abstract" class only requires a name (But it shouldn't be implemented directly).



  * save()

  Saves given data to the data source of the provider. The save method takes the data to save as first parameter, and a callback as second parameter.



  * fetch()

  And both takes a config object and/or a callback as parameter (second and third parameter for method “save()” and first and second parameter for “fetch()”. 

  The callback of the “fetch()” method is called with a parameter that represent the data returned by the storage provider.

  Exemple of usage:

    myProvider.fetch(function (data) {
        // you can do what you need with the data JSON object
    });



  * get()

  get a single value 



  * clearAll()

  clear all values stored into the data source of the provider
  


  * remove()

  remove a single value
  
