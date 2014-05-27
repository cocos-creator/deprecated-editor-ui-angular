angular.module("fireUI.checkbox", [] )
.directive( 'fireUiCheckbox', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            checked: '=fiChecked',
        },
        templateUrl: 'checkbox/checkbox.html',
        link: function (scope, element, attrs ) {
            element
            .on ( 'click', function () {
                scope.checked = !scope.checked;
                scope.$apply();
            })
            ;

            scope.$on( '$destroy', function () {
                element.off('click');
            });
        },
    };
});
