angular.module("fireUI.vec2", [] )
.directive( 'fireUiVec2', function () {
    function preLink ( scope, element, attrs ) {
    }

    function postLink ( scope, element, attrs ) {
    }

    function compile ( element, attrs ) {
        return {
            pre: preLink,
            post: postLink,
        };
    }

    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '=fiValue',
        },
        templateUrl: 'vec2/vec2.html',
        compile: compile,
    };
});
