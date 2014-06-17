angular.module("fireUI.label", [] )
.directive( 'fireUiLabel', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: 'label/label.html',
    };
});
