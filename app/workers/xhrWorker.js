/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true, Q:true */

(function () {
    var isWebWorker = (!this.document);
    if (false === isWebWorker) {
        throw new Error('Cannot instance a Web Worker in the global scope.');
    }

    var self = self || this;

    function onError(e) {
        self.postMessage('error', e);
    }
    
    function onLog(e) {
        self.postMessage('log', e);
    }

    self.addEventListener('message', function (e) {
        
        var data = JSON.stringify(e.data.data);
        var url = e.data.url;
        
        var req = new XMLHttpRequest();

        req.open('POST', '../' + url, false);

        req.setRequestHeader('Content-Type', 'application/json;  charset=utf-8');

        req.onreadystatechange = function () {
            
            if (req.readyState == 4 && req.status == 200) {
                self.postMessage({ 'error': false, 'data': JSON.parse( req.response ) });
            } else {
                self.postMessage({ 'error': true, 'status': req.statusText, 'data': req.response });
            }
        };

        req.onerror = onError;
        req.onabort = onError;
        req.onprogress = onLog;

        req.send(data);
    });

}());