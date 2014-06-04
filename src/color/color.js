angular.module("fireUI.color", [] )
.directive( 'fireUiColor', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            bind: '=fiBind',
        },
        templateUrl: 'color/color.html',
        link: function (scope, element, attrs ) {
            var previewRGB = element.find('#preview-rgb');
            var previewA = element.find('#preview-alpha');

            var updateColor = function () {
                previewRGB.css( 'background-color', scope.bind.toCSS('rgba') );
                previewA.css( 'width', Math.floor(scope.bind.a * 100)+'%' );
            };

            updateColor();

            // scope
            scope.onClick = function () {
                // console.log("todo");
            };

            scope.$watchGroup ( [
                'bind.r', 
                'bind.g', 
                'bind.b', 
                'bind.a'
            ], function ( val, old ) {
                updateColor();
            }); 

            scope.$on('$destroy', function () {
                element.off();
            });

            // element
            element
            .on('focusin', function() {
                element.addClass('focused');
            })
            .on('focusout', function() {
                element.removeClass('focused');
            })
            ;
        },
    };
});
