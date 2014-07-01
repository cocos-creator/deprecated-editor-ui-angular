angular.module("fireUI.section", [] )
.directive( 'fireUiSection', function () {
    function preLink ( scope, element, attrs ) {
        // init tabindex
        var title = element.find('#title');
        title[0].tabIndex = FIRE.getParentTabIndex(title[0])+1;
    }

    function postLink ( scope, element, attrs, ctrl, transclude ) {
        var title = element.find('#title');
        var body = element.find('#body');
        var foldIcon = element.find('#icon');

        scope.folded = false;

        title.on ( 'click', function ( event ) {
            scope.folded = !scope.folded;
            body.toggleClass('hide', scope.folded);
            foldIcon.toggleClass('fa-caret-down', !scope.folded);
            foldIcon.toggleClass('fa-caret-right', scope.folded);
        })
        .on ( 'focusin', function ( event ) {
            title.addClass('focused');
        })
        .on ( 'focusout', function ( event ) {
            if ( title.hasClass('focused') === false )
                return;

            if ( title.find( event.relatedTarget ).length )
                return;
            
            title.removeClass('focused');
        })
        ;

        // reference: http://angular-tips.com/blog/2014/03/transclusion-and-scopes/
        transclude(scope.$parent, function(clone, scope) {
            body.append(clone);
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
        transclude: true,
        scope: {
            title: "@fiTitle",
        },
        templateUrl: 'section/section.html',
        compile: compile,
    };
});
