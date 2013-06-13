/* jshint undef: true, unused: true */
/* global Ext, n$  */

(function (n$) {

    /**
     * Generates a random string that complies to the RFC 4122 specification for GUID/UUID.
     * (e.g. 'B42A153F-1D9A-4F92-9903-92C11DD684D2')
     * While not a true UUID, for the purposes of this application, it should be sufficient.
    */
    var createFauxUUID = function() {
        // http://www.ietf.org/rfc/rfc4122.txt
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        var s = [];
        s.length = 36;

        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i += 1) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    };

    n$.lift('createUUID', createFauxUUID);

}(window.$nameSpace$));
