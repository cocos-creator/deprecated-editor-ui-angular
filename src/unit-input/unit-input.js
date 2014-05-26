angular.module("fireUI.unitInput", [] )
.directive( 'fireUiUnitInput', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'unit-input/unit-input.html',
    };
});
