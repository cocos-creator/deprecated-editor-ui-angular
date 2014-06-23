angular.module("fireUI.checkbox", [] )
.directive( 'fireUiCheckbox', function () {
    function preLink ( scope, element, attrs ) {
        // init tabindex
        element[0].tabIndex = FIRE.getParentTabIndex(element[0])+1;
    }

    function postLink ( scope, element, attrs ) {
        //
        scope.onClick = function () {
            scope.bind = !scope.bind;
        };
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
            bind: '=fiBind',
        },
        templateUrl: 'checkbox/checkbox.html',
        compile: compile,
    };
});
