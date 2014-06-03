angular.module("fireUI.colorPicker", [] )
.directive( 'fireUiColorPicker', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            color: '=fiColor',
        },
        templateUrl: 'color-picker/color-picker.html',
        link: function (scope, element, attrs ) {
        },
    };
});
