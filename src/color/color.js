angular.module("fireUI.color", [] )
.directive( 'fireUiColor', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            bind: '=fiBind',
        },
        templateUrl: 'color/color.html',
        controller: function ( $scope, $element, $compile ) {
            var border = $element.find('#border')[0];
            border = $(border);

            $scope.showColorPicker = function () {
                var el = $compile( "<fire-ui-color-picker fi-color='bind'></fire-ui-color-picker>" )( $scope );
                border.append( el );
                border.removeClass('hide');
            };
            $scope.hideColorPicker = function () {
                border.addClass('hide');
                border.empty();
            };
        },
        link: function (scope, element, attrs ) {
            var previewRGB = element.find('#preview-rgb')[0];
            var previewA = element.find('#preview-alpha')[0];

            var updateColor = function () {
                $(previewRGB).css( 'background-color', scope.bind.toCSS('rgba') );
                $(previewA).css( 'width', Math.floor(scope.bind.a * 100)+'%' );
            };

            updateColor();

            // scope
            scope.onClick = function ( event ) {
                if ( event.target === previewRGB || 
                     event.target === previewA ) {
                    // console.log("todo");
                    scope.showColorPicker();
                }
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
                scope.hideColorPicker();
            })
            ;
        },
    };
});
