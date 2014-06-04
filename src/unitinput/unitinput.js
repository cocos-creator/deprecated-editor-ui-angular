angular.module("fireUI.unitInput", [] )
.directive( 'fireUiUnitinput', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            type: '@fiType',
            unit: '@fiUnit',
            precision: '@fiPrecision',
            bind: '=fiBind',
        },
        templateUrl: 'unitinput/unitinput.html',
        link: function (scope, element, attrs) {
            scope.type = scope.type ? scope.type : 'int';
            scope.unit = scope.unit ? scope.unit : '';
            var precision = scope.precision ? parseInt(scope.precision) : 2;

            var input = element.children('#input');
            var convert = function ( val ) {
                switch ( scope.type ) {
                    case 'int': 
                        val = parseInt(val);
                        if ( isNaN(val) ) 
                            val = 0;
                        return val;

                    case 'float': 
                        val = parseFloat(parseFloat(val).toFixed(precision));
                        if ( isNaN(val) ) 
                            val = 0;
                        return val;
                }
                console.log("can't find proper type for " + scope.type);
                return val;
            };
            input.val(convert(scope.bind));

            // scope
            scope.onUnitClick = function () {
                input.focus();
            };

            scope.onIncrease = function () {
                scope.bind = convert( scope.bind + 1 );
            };

            scope.onDecrease = function () {
                scope.bind = convert( scope.bind - 1 );
            };

            scope.$watch ( 'bind', function ( val, old ) {
                input.val(convert(val));
            });

            scope.$on('$destroy', function () {
                input.off();
                element.off();
            });

            // input
            input
            .on ( 'input', function () {
                var val = convert(input.val());
                scope.bind = val;
                scope.$apply();
            } )
            .on ( 'click', function () {
                input.select();
            } )
            .on ( 'keydown', function () {
                switch ( event.which ) {
                    // enter
                    case 13:
                        scope.bind = convert(input.val());
                        scope.$apply();
                        input.val(scope.bind);
                        input.blur(); 
                    break;

                    // esc
                    case 27:
                        scope.bind = convert(scope.lastVal);
                        scope.$apply();
                        input.val(scope.bind);
                        input.blur(); 
                    break;
                }
            } )
            ;

            // element
            element
            .on('focusin', function() {
                scope.lastVal = scope.bind;
                element.addClass('focused');
            })
            .on('focusout', function() {
                var val = convert(input.val());
                scope.bind = val;
                scope.$apply();
                input.val(val);

                element.removeClass('focused');
            })
            ;
        },
    };
});
