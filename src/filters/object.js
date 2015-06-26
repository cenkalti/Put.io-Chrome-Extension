(function() {
    var module = angular.module('objectFilter', []);

    module.filter('obj_count', function() {
        return function(obj) {
            return Object.keys(obj).length;
        };
    });

})();