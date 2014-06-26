angular.module("fireUI.textArea", [] )
.directive( 'fireUiTextArea', function () {
    function preLink ( scope, element, attrs ) {
        // init tabindex
        var area = element.children('#area');
        area[0].tabIndex = FIRE.getParentTabIndex(area[0])+1;
    }

    function postLink ( scope, element, attrs ) {
        var area = element.children('#area');
        area.val(scope.bind);

        // area
        area
        .on ( 'input', function (event) {
            scope.bind = area.val();
            scope.$apply();

            return false;
        } )
        .on ( 'click', function (event) {
            return false;
        } )
        .on ( 'keydown', function (event) {
            switch ( event.which ) {
                // NOTE: enter will be used as new-line, ESC here will be confirm behavior
                // NOTE: textarea already have ctrl-z undo behavior
                // esc
                case 27:
                    scope.bind = area.val();
                    scope.$apply();
                    area.val(scope.bind);
                    area.blur(); 
                return false;
            }
        } )
        .on ( 'keyup', function (event) {
            var areaEL = area[0];
            var adjustedHeight = Math.max(areaEL.scrollHeight, areaEL.clientHeight);
            if ( adjustedHeight > areaEL.clientHeight )
                areaEL.style.height = adjustedHeight + "px";
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
                var val = area.val();
                scope.bind = val;
                scope.$apply();
                area.val(val);

                element.removeClass('focused');
            }
        })
        ;

        // scope
        scope.$watch ( 'bind', function ( val, old ) {
            area.val(val);
        });

        scope.$on('$destroy', function () {
            area.off();
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
        templateUrl: 'text-area/text-area.html',
        compile: compile,
    };
});
