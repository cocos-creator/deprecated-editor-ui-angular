angular.module("fireUI.checkbox", [] )
.directive( 'fireUiCheckbox', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'checkbox/checkbox.html',
    };
});
