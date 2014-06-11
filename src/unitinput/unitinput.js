angular.module("fireUI.unitInput", [] )
.directive( 'fireUiUnitinput', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            type: '@fiType',
            unit: '@fiUnit',
            precision: '@fiPrecision',
            min: '@fiMin',
            max: '@fiMax',
            interval: '@fiInterval',
            bind: '=fiBind',
        },
        templateUrl: 'unitinput/unitinput.html',
        compile: function(element, attrs) {
            attrs.fiType = (attrs.fiType!==undefined) ? attrs.fiType : 'int';
            attrs.fiUnit = (attrs.fiUnit!==undefined) ? attrs.fiUnit : '';
            attrs.fiPrecision = (attrs.fiPrecision!==undefined) ? attrs.fiPrecision : '2';
            attrs.fiMin = (attrs.fiMin!==undefined) ? attrs.fiMin : 'infinity';
            attrs.fiMax = (attrs.fiMax!==undefined) ? attrs.fiMax : 'infinity';

            var precision = parseInt(attrs.fiPrecision);
            var min = 0;
            var max = 0;
            var interval = 0;

            switch ( attrs.fiType ) {
                case 'int': 
                    attrs.fiInterval = (attrs.fiInterval!==undefined) ? attrs.fiInterval : '1';
                    break;

                case 'float':
                    attrs.fiInterval = (attrs.fiInterval!==undefined) ? parseFloat(attrs.fiInterval) : (1/Math.pow(10,precision)).toFixed(precision);
                    break;
            }

            return function postLink (scope, element, attrs) {
                switch ( scope.type ) {
                    case 'int': 
                        min = (scope.min==='infinity') ? Number.MIN_SAFE_INTEGER : parseInt(scope.min);
                        max = (scope.max==='infinity') ? Number.MAX_SAFE_INTEGER : parseInt(scope.max);
                        interval = parseInt(scope.interval);
                        break;

                    case 'float':
                        min = (scope.min==='infinity') ? -Number.MAX_VALUE : parseFloat(scope.min);
                        max = (scope.max==='infinity') ? Number.MAX_VALUE : parseFloat(scope.max);
                        interval = parseFloat(scope.interval);
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
                        return false;

                        // esc
                        case 27:
                            scope.bind = convert(scope.lastVal);
                            scope.$apply();
                            input.val(scope.bind);
                            input.blur(); 
                        return false;
                    }
                } )
                ;

                // element
                element
                .on('focusin', function(event) {
                    scope.lastVal = scope.bind;
                    element.addClass('focused');
                })
                .on('focusout', function() {
                    if ( element.hasClass('focused') === false )
                        return;

                    //
                    if ( element.find( event.relatedTarget ).length === 0 ) {
                        var val = convert(input.val());
                        scope.bind = val;
                        scope.$apply();
                        input.val(val);

                        element.removeClass('focused');
                    }
                })
                ;
            };
        },
    };
});
