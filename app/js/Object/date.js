(function() {
	
	OJ.lift('toDateFromTicks', function(tickStr) {
		var ticsDateTime = OJ.string(tickStr);
        var ret, ticks, offset, localOffset, arr;
        
        if (false === OJ.is.nullOrEmpty(ticsDateTime)) {
            ticsDateTime = ticsDateTime.replace('/', '');
            ticsDateTime = ticsDateTime.replace('Date', '');
            ticsDateTime = ticsDateTime.replace('(', '');
            ticsDateTime = ticsDateTime.replace(')', '');
            arr = ticsDateTime.split('-');
            if (arr.length > 1) {
                ticks = OJ.number(arr[0]);
                offset = OJ.number(arr[1]);
                localOffset = new Date().getTimezoneOffset();
                ret = new Date((ticks - ((localOffset + (offset / 100 * 60)) * 1000)));
            } else if (arr.length === 1) {
                ticks = OJ.number(arr[0]);
                ret = new Date(ticks);
            }
        }
        return ret;
    });

}());