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

            var input = element.children('#input');
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
            scope.onUnitClick = function () {
                input.focus();
            };

            //
            scope.onIncrease = function () {
                scope.bind += 1;
            };
            scope.onDecrease = function () {
                scope.bind -= 1;
            };

            //
            scope.onInputClick = function () {
                input.select();
            };
            scope.onInputKeydown = function () {
                switch ( event.which ) {
                    // enter
                    case 13:
                        input.blur(); 
                    break;

                    // esc
                    case 27:
                        scope.bind = scope.lastVal;
                        input.blur(); 
                    break;
                }
            };
        },
    };
});
