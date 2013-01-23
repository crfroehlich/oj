(function () {
    'use strict';
    var OjInternal = {
        bindingObj: $({})
    };
    
    OJ.lift('subscribe', function () {
        OjInternal.bindingObj.on.apply(OjInternal.bindingObj, arguments);
    });


    OJ.lift('unsubscribe', function () {
        OjInternal.bindingObj.off.apply(OjInternal.bindingObj, arguments);
    });


    OJ.lift('publish', function () {
        OjInternal.bindingObj.trigger.apply(OjInternal.bindingObj, arguments);
    });


	OJ.lift('listBindings', function() {
		for (var prop in OjInternal.bindingObj[0]) {
			if (OjInternal.bindingObj[0].hasOwnProperty(prop)) {
				if (OjInternal.bindingObj[0][prop].events) {
					return OjInternal.bindingObj[0][prop].events;
				}
			}
		}
    });
    
} ());