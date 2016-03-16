(function(window, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // Register Tondo as an AMD module
        define(factory);

    } else if (typeof module == 'object' && module.exports) {
        // Register Tondo for CommonJS
        module.exports = factory;

    } else {
        // Register Tondo on window
        window.Tondo = factory();
    }

})(window, function() {
