/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true, Q:true */

(function() {

    n$.register('workers', n$.makeNameSpace());

    /**
     * Instance a web worker in an independent thread to make an AJAX POST request
     * Returns an object with a promise to fulfill the request
     * If web workers are supported, returns a handle on the worker
     *    else, returns the promise as a traditional AJAX promise
     */
    n$.workers.register('ajax', function(url, data) {

        var ret = n$.object();

        if (window.Modernizr.webworkers) { //Chrome, FF, IE10+
            var deferred = Q.defer();
            ret.promise = Q.promise;

            ret.webWorker = new Worker('webworkers/xhrWorker.js');

            ret.listenTo = ret.webWorker.addEventListener;

            ret.webWorker.addEventListener('message', function(e) {
                if (e.error) {
                    deferred.reject(new Error(e));
                }
                else {
                    deferred.resolve(e.data);
                }
            }, false);

            ret.webWorker.addEventListener('error', function(e) {
                deferred.reject(new Error(e));
            }, false);

            ret.webWorker.addEventListener('log', function(e) {
                deferred.notify(e);
            }, false);

            ret.message = {
                data: data,
                url: 'Services/' + url
            };

            ret.webWorker.postMessage(ret.message);
        }
        else { //IE9
            throw new Error('Web Workers are not supported. Update to a modern browser.')
        }
        return ret;
    });




}());