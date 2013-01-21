(function () {
    'use strict';
    var OjInternal = {
        bindingObj: $({})
    };

    OJ.subscribe = OJ.subscribe ||
        OJ.lift('subscribe', function () {
            OjInternal.bindingObj.on.apply(OjInternal.bindingObj, arguments);
        });

    OJ.unsubscribe = OJ.unsubscribe ||
        OJ.lift('unsubscribe', function () {
            OjInternal.bindingObj.off.apply(OjInternal.bindingObj, arguments);
        });

    OJ.publish = OJ.publish ||
        OJ.lift('publish', function () {
            OjInternal.bindingObj.trigger.apply(OjInternal.bindingObj, arguments);
        });

    OJ.listBindings = OJ.listBindings || 
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