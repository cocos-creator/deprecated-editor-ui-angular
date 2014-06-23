angular.module("fireUI.customField", [] )
.directive( 'fireUiCustomField', ['$compile', function ( $compile ) {
    function postLink (scope, element, attrs) {
    }

    function compile ( element, attrs ) {
        function camelCaseToHuman ( text ) {
            var result = text.replace(/([A-Z])/g, ' $1');

            // remove first white-space
            if ( result.charAt(0) == ' ' ) {
                result.slice(1);
            }

            // capitalize the first letter
            return result.charAt(0).toUpperCase() + result.slice(1);
        }
        attrs.fiName = (attrs.fiName!==undefined) ? attrs.fiName : camelCaseToHuman(attrs.fiBind);

        return postLink;
    }

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            name: '@fiName',
        },
        templateUrl: 'custom-field/custom-field.html',
        compile: compile,
    };
}]);
