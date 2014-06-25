angular.module("fireUI.textInput", [] )
.directive( 'fireUiTextInput', function () {
    function preLink ( scope, element, attrs ) {
        // init tabindex
        var input = element.children('#input');
        input[0].tabIndex = FIRE.getParentTabIndex(input[0])+1;
    }

    function postLink ( scope, element, attrs ) {
        var input = element.children('#input');
        input.val(scope.bind);

        // input
        input
        .on ( 'input', function (event) {
            scope.bind = input.val();
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
                    scope.bind = input.val();
                    scope.$apply();
                    input.val(scope.bind);
                    input.blur(); 
                return false;

                // esc
                case 27:
                    scope.bind = scope.lastVal;
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
        .on('focusout', function(event) {
            if ( element.hasClass('focused') === false )
                return;

            //
            if ( element.find( event.relatedTarget ).length === 0 ) {
                var val = input.val();
                scope.bind = val;
                scope.$apply();
                input.val(val);

                element.removeClass('focused');
            }
        })
        ;

        // scope
        scope.$watch ( 'bind', function ( val, old ) {
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
            bind: '=fiBind',
        },
        templateUrl: 'text-input/text-input.html',
        compile: compile,
    };
});
