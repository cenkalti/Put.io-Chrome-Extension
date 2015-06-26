(function() {
    var module = angular.module('stringFilter', []);

    module.filter('capitalize', function() {
        return function(input) {
            return input.charAt(0).toUpperCase() + input.slice(1);
        };
    });

    module.filter('pad', function() {
        return function(input) {
            if (input < 10) {
                return "0" + input;
            } else {
                return input;
            }
        };
    });

})();