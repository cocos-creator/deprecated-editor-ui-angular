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
            scope.type = scope.type ?  scope.type : 'int';
            scope.unit = scope.unit ?  scope.unit : '';

            var input = element.children('#input');
            var convert = function ( val ) {
                switch ( scope.type ) {
                    case 'int': 
                        val = parseInt(val);
                        if ( isNaN(val) ) 
                            val = 0;
                        return val;

                    case 'float': 
                        val = parseFloat(val);
                        if ( isNaN(val) ) 
                            val = 0;
                        return val;
                }
                console.log("can't find proper type for " + scope.type);
                return val;
            };
            input.val(scope.bind);

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
                if ( val !== old ) {
                    input.val(val);
                }
            });

            // input
            input
            .on ( 'input', function () {
                var val = convert(input.val());
                input.val(val);
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
                        scope.bind = convert(scope.bind);
                        scope.$apply();
                        input.blur(); 
                    break;

                    // esc
                    case 27:
                        scope.bind = convert(scope.lastVal);
                        scope.$apply();
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
                scope.$apply( function () {
                    if ( scope.bind !== scope.lastVal ) {
                        scope.bind = convert(scope.bind);
                    }
                } );
                element.removeClass('focused');
            })
            ;
        },
    };
});
