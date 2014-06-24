angular.module("fireUI.button", [] )
.directive( 'fireUiButton', function () {
    function preLink ( scope, element, attrs ) {
        // init tabindex
        element[0].tabIndex = FIRE.getParentTabIndex(element[0])+1;
    }

    function postLink ( scope, element, attrs ) {
        //
        scope.onClick = function () {
            // TODO
        };

        // element
        element
        .on ( 'focusin', function ( event ) {
            element.addClass('focused');
        })
        .on ( 'focusout', function ( event ) {
            if ( element.hasClass('focused') === false )
                return;

            if ( element.find( event.relatedTarget ).length === 0 ) {
                element.removeClass('focused');
            }
        })
        ;
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
        transclude: true,
        scope: {
        },
        templateUrl: 'button/button.html',
        compile: compile,
    };
});
