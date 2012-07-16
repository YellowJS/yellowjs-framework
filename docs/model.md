Model
=====

  Class: Model  
  Namespace: oo.data  
  Extends: -  
  Mixins: oo.core.mixins.Events


Description
-----------

  This class is an abstract class that defines main behavior for a model that is in charge of data management

  You should use the "oo.createModel" function in order to create a model (see the Core class documentation).

  Instances of this class can be seen as a collection of data. 

  Two of the most important methods of the Model are “fetch()” and “commit()” methods. As their name shows it, the first one fetch data from the provider and the second one save data via the provider. These methods are ones of those that connect the model and its data source. Once data has been fetched, you can retrieve/update/remove à local "copy" with the methods "get", "getBy", "filterBy", etc...

  To ensure you will not try to use/work with data while no data has been fetched yet, events are emitted by the model, see the oo.core.mixins.Events for more information about how to use events


Events
------

  AFTER_FETCH  - this event is triggered when the fetch operation is done  
  AFTER_COMMIT - this event is triggered when the commit operation is done


Methods
-------

  * static register()

  in order to access your model everywhere in your application, you should register it via this metod, then you may use the "oo.getModel" function to retrieve it from anywhere.

  _Note_: if you use the "oo.createModel" function, you won't have to register your model



  * static unregister()

  unregister a model from the model repository



  * static get()

  mainly used internally to get registered model instance. give the model name as argument to this method and it will return the right instance, you can use the "oo.getModel" instead.



  * constructor

  The constructor class expect a configuration object in order to pre configure your model. This configuration object must contains at least a "name" and a "provider" property.

  The "name" is a string that will be used as an identifier, the provider is a configuration object itself, see the documentation of the different providers class.

  you may also provide an array of string, describing fields that will be used as index, under the property "indexes"

  Example:

    var myModel = new oo.data.Model({
      name: "my-model", 
      provider: {
        type: "local"
      },
      indexes: ["id", "name"]
    })



  * setProvider()

  set a provider depending on the argument given. This arguments can be a either an object that will be used as argument for the provider constructor, or an instance of oo.data.Provider.



  * getModelName()

  get the name of the model



  * setModelName()

  set the name of the model



  * setIndexes()

  set the indexes if there were not set via the constructor, and trigger a indexes update



  * fetch()

  send a "request" to the provider to refresh internal stored data, it accepts one arguments that is mandatory but can be either a function used as a callback or a config object that may contain the properties "success" and "params". "success" must be a function that will be used as callback and params must be an object (but is optional) that describe parameters that will be sent to the data provider.

  Example (using events)

    var myModel = oo.getModel('my-model');
    // callback is a function that will be called when the fetch event is triggered
    myModel.addListener(AFTER_FETCH, callback)
    myModel.fetch();


  * commit()

  commit update made on internal data via the data provider



  * getData()

  returns the array of data internally stored into the instance



  * setData()

  set the array of data to the internal store of the instance



  * clearAll()

  clear data from the internal store



  * filterBy()

  returns a subset (array) of the internal stored data filtered with the given parameters. This function has 2 arguments, the first one is key on which filter will be applied, and the second is the value that should be matched

  Example:

    var myModel = oo.getModel('my-model');
    var resultSet = myModel.filterBy('category', 12);
    console.log(resultSet.length)      // output the length of the resultset

    

  * getBy()

  returns an object representing data stored into the internal storage. it works the same way the function "filterBy" do but returns a single record



  * get()

  returns an object representing data stored into the internal storage. it works the same way the "getBy" function do, but consider the "property" against which it will test the given value (as argument) is always "key"



  * set()

  set data in order to update an already existing key, or add a new one (if not exists) into the storage. Use the "key" property to identify a uniq record. You'll need to "commit" changes to make them persist




  * add()

  add a record to the internal storage work the same way as the set, but perform only add operation and throw an error when trying to add a record with an already existing "key" property



  * removeBy()

  find and remove record(s) from the internal storage. use its arguments the same way it does for functions "getBy" and "filterBy"



  * remove()

  find and remove a single record from the internal storage. use its arguments the same way it does for the "get" function
