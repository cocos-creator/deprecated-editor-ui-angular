angular.module("fireUI.uploader", [] )
.directive( 'fireUiUploader', function () {
    function preLink ( scope, element, attrs ) {
        var btn = element.find('button');

        // init tabindex
        btn[0].tabIndex = FIRE.getParentTabIndex(btn[0])+1;
    }

    function postLink ( scope, element, attrs ) {
        var dummyInput = element.find('#dummy');

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

        scope.onClick = function ( event ) {
            dummyInput.click();
            return false;
        }
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
        },
        templateUrl: 'uploader/uploader.html',
        compile: compile,
    };
});
