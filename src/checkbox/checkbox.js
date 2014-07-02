angular.module("fireUI.checkbox", [] )
.directive( 'fireUiCheckbox', function () {
    function preLink ( scope, element, attrs ) {
        // init tabindex
        element[0].tabIndex = FIRE.getParentTabIndex(element[0])+1;
    }

    function postLink ( scope, element, attrs ) {
        //
        scope.clickAction = function ( event ) {
            scope.value = !scope.value;
            return false;
        };

        // element
        element
        .on ( 'focus', function ( event ) {
            element.addClass('focused');
        })
        .on ( 'blur', function ( event ) {
            if ( element.hasClass('focused') === false )
                return;

            if ( element.find( event.relatedTarget ).length )
                return;
            
            element.removeClass('focused');
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
            value: '=fiValue',
        },
        templateUrl: 'checkbox/checkbox.html',
        compile: compile,
    };
});
