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
            min: '=fiMin',
            max: '=fiMax',
            interval: '=fiInterval',
        },
        templateUrl: 'unitinput/unitinput.html',
        link: function (scope, element, attrs) {
            scope.type = (scope.type!==undefined) ? scope.type : 'int';
            scope.unit = (scope.unit!==undefined) ? scope.unit : '';
            var precision = (scope.precision!==undefined) ? parseInt(scope.precision) : 2;
            var min = 0;
            var max = 0;
            var interval = 0;

            switch ( scope.type ) {
                case 'int': 
                    min = (scope.min!==undefined) ? parseInt(scope.min) : Number.MIN_SAFE_INTEGER;
                    max = (scope.max!==undefined) ? parseInt(scope.max) : Number.MAX_SAFE_INTEGER;
                    interval = (scope.interval!==undefined) ? parseInt(scope.interval) : 1;
                    break;

                case 'float':
                    min = (scope.min!==undefined) ? parseFloat(scope.min) : -Number.MAX_VALUE;
                    max = (scope.max!==undefined) ? parseFloat(scope.max) : Number.MAX_VALUE;
                    interval = (scope.interval!==undefined) ? parseFloat(scope.interval) : 1/Math.pow(10,precision);
                    break;
            }

            var input = element.children('#input');
            var convert = function ( val ) {
                switch ( scope.type ) {
                    case 'int': 
                        val = parseInt(val);
                        if ( isNaN(val) ) 
                            val = 0;
                        val = Math.min( Math.max( val, min ), max );
                        return val;

                    case 'float': 
                        val = parseFloat(parseFloat(val).toFixed(precision));
                        if ( isNaN(val) ) 
                            val = 0;
                        val = Math.min( Math.max( val, min ), max );
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

            scope.onIncrease = function ( event ) {
                scope.bind = convert( scope.bind + interval );
                event.stopPropagation();
            };

            scope.onDecrease = function ( event ) {
                scope.bind = convert( scope.bind - interval );
                event.stopPropagation();
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
            .on ( 'input', function (event) {
                if ( event.target.value === "-" ) {
                    return;
                }
                if ( event.target.value === "." ) {
                    event.target.value = "0.";
                    return;
                }
                if ( event.target.value === "-." ) {
                    event.target.value = "-0.";
                    return;
                }

                var val = convert(input.val());
                scope.bind = val;
                scope.$apply();

                return false;
            } )
            .on ( 'click', function () {
                input.select();

                return false;
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
