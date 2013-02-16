(function() {

    /***
     *   Function
    */

    Function.prototype.inheritsFrom = function(parentClassOrObject) {
        if (parentClassOrObject.constructor === Function) {
            //Normal Inheritance
            this.prototype = new parentClassOrObject;
            this.prototype.constructor = this;
            this.prototype.parent = parentClassOrObject.prototype;
        } else {
            //Pure Virtual Inheritance
            this.prototype = parentClassOrObject;
            this.prototype.constructor = this;
            this.prototype.parent = parentClassOrObject;
        }
        return this;
    };


    /***
     *   End Function
    */


}());