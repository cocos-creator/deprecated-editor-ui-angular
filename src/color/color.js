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
            var previewRGB = self.querySelector('#preview-rgb');
            var previewA = self.querySelector('#preview-alpha');
            var iconDown = self.querySelector('#icon-down');
            var border = self.querySelector('#border');
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
                    if ( border.classList.contains('hide') ) {
                        scope.showColorPicker();
                    }
                    else {
                        scope.hideColorPicker();
                    }
                }
            };

            scope.showColorPicker = function () {
                if ( border.classList.contains('hide') === false ) {
                    return;
                }

                if ( ngPromise !== null ) {
                    $timeout.cancel(ngPromise);
                }

                if ( ngColorPicker === null ) {
                    ngColorPicker = $compile( "<fire-ui-color-picker fi-color='bind'></fire-ui-color-picker>" )( scope );
                    border.appendChild( ngColorPicker[0] );
                }

                border.classList.remove('hide');
            };

            scope.hideColorPicker = function () {
                if ( border.classList.contains('hide') ) {
                    return;
                }

                border.classList.add('hide');

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
                self.onfocusin = null;
                self.onfocusout = null;
                self.onkeydown = null;
            });

            // element
            self.onfocusin = function() {
                self.classList.add('focused');
            };

            self.onfocusout = function() {
                if ( self.classList.contains('focused') === false )
                    return;

                if ( event.relatedTarget === null &&
                     FIRE.find ( self.querySelectorAll('.fire-ui-unitinput'), event.target ) )
                {
                    self.focus();
                    return;
                }

                if ( FIRE.find( self, event.relatedTarget ) === false ) {
                    self.classList.remove('focused');
                    scope.hideColorPicker();
                }
            };

            self.onkeydown = function () {
                switch ( event.which ) {
                    // esc
                    case 27:
                        self.blur(); 
                        self.classList.remove('focused');
                        scope.hideColorPicker();
                    return false;
                }
            };
        },
    };
}]);
