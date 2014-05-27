angular.module("fireUI.unitInput", [] )
.directive( 'fireUiUnitinput', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'unitinput/unitinput.html',
        link: function (scope, element, attrs) {
            var unit = element.children('.unit');
            var input = element.children('.input');

            //
            element
            .on('focusin', function() {
                element.addClass('focused');
            })
            .on('focusout', function() {
                element.removeClass('focused');
            })
            ;

            //
            unit.on('click', function() {
                input.focus();
            })
            ;

            //
            input.on('keydown', function(event) {
                switch ( event.which ) {
                    // enter
                    case 13:
                        input.blur(); 
                    break;

                    // esc
                    case 27:
                        // TODO: Reset
                        input.blur(); 
                    break;
                }
            })
            ;
        },
    };
});
