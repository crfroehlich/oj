/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _listenerIIFE(n$) {

     /**
      * The private constructor for a Subscribers object.
      * @param listenerType {String} The name of the subscriber to create
      * @param namespace {String} The NameSpace to which the subscriber belongs
     */
      var Subscribers = function (listenerType, namespace) {
          if (!(n$[namespace])) {
              throw new Error('No subscriber class "' + namespace + '" has been defined.');
          }
          if (!(n$[namespace].constants.subscribers)) {
              throw new Error('No subscribers have been defined.');
          }
          
          var that = this;
          var subscribers = [];
          n$.property(that, 'add',
              /**
                   * For a known subscriber name, apply the appropriate arguments as defined by Ext to a method wrapper to be assigned as the subscriber.
                   * @param name {n$.constants.listenerType} Name of the subscriber
                   * @param method {Function} callback method
                  */
              function(name, method) {
                  if (!(n$[namespace].constants.subscribers.has(name))) {
                      throw new Error('SubscriberType type ' + name + ' is not supported.');
                  }
                  if (-1 !== subscribers.indexOf(name)) {
                      throw new Error(namespace + ' already containts a listenere for ' + name + '.');
                  }
                  subscribers.push(name);

                  var subscriber = n$[namespace].subscribers[name](method);

                  n$.property(that, name, subscriber);

                  return that;

              }, false, false, false);
      
          return that;
      };

      n$.instanceOf.register('Subscribers', Subscribers);

     /**
      * Create a new subscribers collection. This returns a subscribers object with an add method.
      * @param listenerType {String} The name of the subscriber to create
      * @param namespace {String} The NameSpace to which the subscriber belongs
     */
      n$.register('makeSubscribers', function (listenerType, namespace) {
          var ret = new Subscribers(listenerType, namespace);
          return ret;
      });


}(window.$nameSpace$));
