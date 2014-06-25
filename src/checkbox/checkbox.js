angular.module("fireUI.checkbox", [] )
.directive( 'fireUiCheckbox', function () {
    function preLink ( scope, element, attrs ) {
        // init tabindex
        element[0].tabIndex = FIRE.getParentTabIndex(element[0])+1;
    }

    function postLink ( scope, element, attrs ) {
        //
        scope.onClick = function () {
            scope.checked = !scope.checked;
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
        scope: {
            checked: '=fiBind',
        },
        templateUrl: 'checkbox/checkbox.html',
        compile: compile,
    };
});
