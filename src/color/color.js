angular.module("fireUI.color", [
    'fireUI.colorPicker',
] )
.directive( 'fireUiColor', ['$compile', '$timeout',  function ( $compile, $timeout ) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            bind: '=fiBind',
        },
        templateUrl: 'color/color.html',
        link: function (scope, element, attrs ) {
            var previewRGB = element.find('#preview-rgb')[0];
            var previewA = element.find('#preview-alpha')[0];
            var border = element.find('#border');
            var colorPickerEL = null;
            var promise = null;

            var updateColor = function () {
                $(previewRGB).css( 'background-color', scope.bind.toCSS('rgba') );
                $(previewA).css( 'width', Math.floor(scope.bind.a * 100)+'%' );
            };

            updateColor();

            // scope
            scope.onClick = function ( event ) {
                if ( event.target === previewRGB || 
                     event.target === previewA ) {
                    if ( border.hasClass('hide') ) {
                        scope.showColorPicker();
                    }
                    else {
                        scope.hideColorPicker();
                    }
                }
            };

            scope.showColorPicker = function () {
                if ( promise !== null ) {
                    $timeout.cancel(promise);
                }

                if ( colorPickerEL === null ) {
                    colorPickerEL = $compile( "<fire-ui-color-picker fi-color='bind'></fire-ui-color-picker>" )( scope );
                    border.append( colorPickerEL );
                }

                border.removeClass('hide');
            };

            scope.hideColorPicker = function () {
                border.addClass('hide');

                if ( colorPickerEL !== null ) {
                    // TODO: we need to add border.disable(); which will prevent event during fadeout 
                    promise = $timeout( function () {
                        colorPickerEL.isolateScope().$destroy();
                        colorPickerEL.remove();
                        colorPickerEL = null;
                        promise = null;
                    }, 300 );
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
                if ( element.hasClass('focused') === false )
                    return;

                if ( event.relatedTarget === null &&
                     element.find('.fire-ui-unitinput').find(event.target).length > 0 )
                {
                    element.focus();
                    return;
                }

                if ( element.find( event.relatedTarget ).length === 0 ) {
                    element.removeClass('focused');
                    scope.hideColorPicker();
                }
            })
            .on ( 'keydown', function () {
                switch ( event.which ) {
                    // esc
                    case 27:
                        element.blur(); 
                    return false;
                }
            })
            ;
        },
    };
}]);
