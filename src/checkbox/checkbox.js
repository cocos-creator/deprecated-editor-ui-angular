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
            element
            .on ( 'click', function () {
                scope.bind = !scope.bind;
                scope.$apply();
            })
            ;

            scope.$on( '$destroy', function () {
                element.off('click');
            });
        },
    };
});
