angular.module("fireUI.checkbox", [] )
.directive( 'fireUiCheckbox', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            bind: '=fiBind',
        },
        templateUrl: 'checkbox/checkbox.html',
        link: function (scope, element, attrs ) {
            scope.onClick = function () {
                scope.bind = !scope.bind;
            };
        },
    };
});
