angular.module("fireUI.select", [] )
.directive( 'fireUiSelect', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '=fiBind',
            options: '=fiOptions',
        },
        templateUrl: 'select/select.html',
        link: function (scope, element, attrs) {
            var menu = element.children('.menu');

            var updateValueName = function () {
                for ( var i = 0; i < scope.options.length; ++i ) {
                    var entry = scope.options[i];
                    if ( entry.value === scope.value ) {
                        scope.valueName = entry.name;
                        break;
                    }
                }
            };
            updateValueName ();

            //
            scope.onSelect = function ( event ) {
                var idx = parseInt(event.target.getAttribute('index'));
                var entry = scope.options[idx];
                scope.value = entry.value;

                menu.addClass('hide');
                event.stopPropagation();
            };

            scope.$watch( 'value', function ( val, old ) {
                if ( val !== old ) {
                    updateValueName ();
                }
            } );

            scope.$on('$destroy', function () {
                element.off();
            });

            //
            element
            .on('click', function () {
                menu.toggleClass('hide');
                scope.$apply();
            })
            .on('focusin', function() {
                element.addClass('focused');

                return false;
            })
            .on('focusout', function () {
                menu.addClass('hide');
                scope.$apply();
                element.removeClass('focused');

                return false;
            })
            .on ( 'keydown', function () {
                switch ( event.which ) {
                    // esc
                    case 27:
                        element.blur(); 
                    break;
                }
            } )
            ;
        },
    };
});
