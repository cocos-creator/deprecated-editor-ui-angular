angular.module("fireUI.button", [] )
.directive( 'fireUiButton', function () {
    function preLink ( scope, element, attrs ) {
        var btn = element.find('button');

        // init tabindex
        btn[0].tabIndex = FIRE.getParentTabIndex(btn[0])+1;
    }

    function postLink ( scope, element, attrs ) {
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
        // .on ( 'click', function ( event ) {
        //     scope.$apply( function() {
        //         scope.doClick();
        //     });
        //     return false;
        // })
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
        // scope: {
        //     doClick: '&fiClick',
        // },
        templateUrl: 'button/button.html',
        compile: compile,
    };
});
