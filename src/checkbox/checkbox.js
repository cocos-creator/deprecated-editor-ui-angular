angular.module("fireUI.checkbox", [] )
.directive( 'fireUiCheckbox', function () {
    function link ( scope, element, attrs ) {
        scope.onClick = function () {
            scope.bind = !scope.bind;
        };
    }

    return {
        restrict: 'E',
        replace: true,
        scope: {
            bind: '=fiBind',
        },
        templateUrl: 'checkbox/checkbox.html',
        link: link,
    };
});
