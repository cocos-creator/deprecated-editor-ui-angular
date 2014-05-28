angular.module("fireUI.unitInput", [] )
.directive( 'fireUiUnitinput', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            type: '@fiType',
            unit: '@fiUnit',
            bind: '=fiBind',
        },
        templateUrl: 'unitinput/unitinput.html',
        link: function (scope, element, attrs) {
            scope.type = scope.type ?  scope.type : 'number';
            scope.unit = scope.unit ?  scope.unit : '';

            var unit = element.children('.unit');
            var input = element.children('.input');
            var unitButtons = element.children('.unit-buttons');
            var btnUp = unitButtons.children('#up');
            var btnDown = unitButtons.children('#down');

            input.val(scope.bind);

            //
            element
            .on('focusin', function() {
                scope.lastVal = scope.bind;
                element.addClass('focused');
            })
            .on('focusout', function() {
                element.removeClass('focused');
            })
            ;

            //
            unit
            .on('click', function() {
                input.focus();
            })
            ;

            //
            btnUp
            .on('click', function() {
                scope.bind += 1;
                scope.$apply();
            })
            ;

            btnDown
            .on('click', function() {
                scope.bind -= 1;
                scope.$apply();
            })
            ;

            //
            input
            .on('input', function(event) {
                scope.bind = input.val();
                scope.$apply();
            })
            .on('click', function(event) {
                input.select();
            })
            .on('keydown', function(event) {
                switch ( event.which ) {
                    // enter
                    case 13:
                        input.blur(); 
                    break;

                    // esc
                    case 27:
                        scope.bind = scope.lastVal;
                        scope.$apply();

                        input.blur(); 
                    break;
                }
            })
            ;

            scope.$watch('bind', function( val, old ) {
                if ( val !== old ) {
                    input.val(val);
                }
            })
            ;
        },
    };
});
