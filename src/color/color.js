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
            var self = element[0];
            var previewRGB = element.find('#preview-rgb')[0];
            var previewA = element.find('#preview-alpha')[0];
            var iconDown = element.find('#icon-down')[0];
            var border = element.find('#border')[0];

            var ngColorPicker = null;
            var ngPromise = null;

            var updateColor = function () {
                previewRGB.style.backgroundColor = scope.bind.toCSS('rgba');
                previewA.style.width = Math.floor(scope.bind.a * 100)+'%';
            };

            updateColor();

            // scope
            scope.onClick = function ( event ) {
                if ( event.target === previewRGB || 
                     event.target === previewA ||
                     event.target === iconDown ||
                     event.target === self ) {
                    if ( $(border).hasClass('hide') ) {
                        scope.showColorPicker();
                    }
                    else {
                        scope.hideColorPicker();
                    }
                }
            };

            scope.showColorPicker = function () {
                var jqBorder = $(border);
                if ( jqBorder.hasClass('hide') === false ) {
                    return;
                }

                if ( ngPromise !== null ) {
                    $timeout.cancel(ngPromise);
                }

                if ( ngColorPicker === null ) {
                    ngColorPicker = $compile( "<fire-ui-color-picker fi-color='bind'></fire-ui-color-picker>" )( scope );
                    jqBorder.append( ngColorPicker[0] );
                }

                jqBorder.removeClass('hide');
            };

            scope.hideColorPicker = function () {
                var jqBorder = $(border);
                if ( jqBorder.hasClass('hide') ) {
                    return;
                }

                jqBorder.addClass('hide');

                if ( ngColorPicker !== null ) {
                    // TODO: we need to add border.disable(); which will prevent event during fadeout 
                    ngPromise = $timeout( function () {
                        ngColorPicker.isolateScope().$destroy();
                        ngColorPicker.remove();
                        ngColorPicker = null;
                        ngPromise = null;
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
            .on ( 'focusin', function ( event ) {
                element.addClass('focused');
            })
            .on ( 'focusout', function ( event ) {
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
            .on ( 'keydown', function (event) {
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
