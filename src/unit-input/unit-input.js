angular.module("fireUI.unitInput", [] )
.directive( 'fireUiUnitInput', function () {
    function preLink ( scope, element, attrs ) {
        // init tabindex
        var input = element.children('#input');
        input[0].tabIndex = FIRE.getParentTabIndex(input[0])+1;

    }

    function postLink (scope, element, attrs) {
        var precision = parseInt(attrs.fiPrecision);
        var min = 0;
        var max = 0;
        var interval = 0;

        switch ( scope.type ) {
            case 'int': 
                min = (scope.min==='infinity') ? Number.NEGATIVE_INFINITY : parseInt(scope.min);
                max = (scope.max==='infinity') ? Number.POSITIVE_INFINITY : parseInt(scope.max);
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
        input.val(convert(scope.value));

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
            scope.value = val;
            scope.$apply();

            return false;
        } )
        .on ( 'click', function (event) {
            return false;
        } )
        .on ( 'keydown', function (event) {
            switch ( event.which ) {
                // enter
                case 13:
                    scope.value = convert(input.val());
                    scope.$apply();
                    input.val(scope.value);
                    input.blur(); 
                return false;

                // esc
                case 27:
                    scope.value = convert(scope.lastVal);
                    scope.$apply();
                    input.val(scope.value);
                    input.blur(); 
                return false;
            }
        } )
        .on('focus', function(event) {
            scope.lastVal = scope.value;
            element.addClass('focused');
        })
        .on('blur', function(event) {
            if ( element.hasClass('focused') === false )
                return;

            if ( element.find( event.relatedTarget ).length )
                return;
            
            var val = convert(input.val());
            scope.value = val;
            scope.$apply();
            input.val(val);

            element.removeClass('focused');
        })
        ;

        // scope
        scope.onUnitClick = function () {
            input.focus();
        };

        scope.onIncrease = function ( event ) {
            scope.value = convert( scope.value + interval );
            input.focus();
            event.stopPropagation();
        };

        scope.onDecrease = function ( event ) {
            scope.value = convert( scope.value - interval );
            input.focus();
            event.stopPropagation();
        };

        scope.$watch ( 'value', function ( val, old ) {
            input.val(convert(val));
        });

        scope.$on('$destroy', function () {
            input.off();
            element.off();
        });
    }

    function compile ( element, attrs ) {
        attrs.fiType = (attrs.fiType!==undefined) ? attrs.fiType : 'int';
        attrs.fiUnit = (attrs.fiUnit!==undefined) ? attrs.fiUnit : '';
        attrs.fiPrecision = (attrs.fiPrecision!==undefined) ? attrs.fiPrecision : '2';
        attrs.fiMin = (attrs.fiMin!==undefined) ? attrs.fiMin : 'infinity';
        attrs.fiMax = (attrs.fiMax!==undefined) ? attrs.fiMax : 'infinity';
        var precision = parseInt(attrs.fiPrecision);

        switch ( attrs.fiType ) {
            case 'int': 
                attrs.fiInterval = (attrs.fiInterval!==undefined) ? attrs.fiInterval : '1';
                break;

            case 'float':
                attrs.fiInterval = (attrs.fiInterval!==undefined) ? parseFloat(attrs.fiInterval) : (1/Math.pow(10,precision)).toFixed(precision);
                break;
        }

        return {
            pre: preLink,
            post: postLink,
        };
    }

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
            value: '=fiValue',
        },
        templateUrl: 'unit-input/unit-input.html',
        compile: compile,
    };
});
