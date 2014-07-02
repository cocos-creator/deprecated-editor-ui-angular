angular.module("fireUI.textInput", [] )
.directive( 'fireUiTextInput', function () {
    function preLink ( scope, element, attrs ) {
        // init tabindex
        var input = element.children('#input');
        input[0].tabIndex = FIRE.getParentTabIndex(input[0])+1;
    }

    function postLink ( scope, element, attrs ) {
        var input = element.children('#input');
        input.val(scope.value);

        // input
        input
        .on ( 'input', function (event) {
            scope.value = input.val();
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
                    scope.value = input.val();
                    scope.$apply();
                    input.val(scope.value);
                    input.blur(); 
                return false;

                // esc
                case 27:
                    scope.value = scope.lastVal;
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

            //
            if ( element.find( event.relatedTarget ).length )
                return;
            
            var val = input.val();
            scope.value = val;
            scope.$apply();
            input.val(val);

            element.removeClass('focused');
        })
        ;

        // scope
        scope.$watch ( 'value', function ( val, old ) {
            input.val(val);
        });

        scope.$on('$destroy', function () {
            input.off();
            element.off();
        });
    }

    function compile ( element, attrs ) {
        return {
            pre: preLink,
            post: postLink,
        };
    }

    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '=fiValue',
        },
        templateUrl: 'text-input/text-input.html',
        compile: compile,
    };
});
