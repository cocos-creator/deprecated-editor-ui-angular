angular.module("fireUI.textArea", [] )
.directive( 'fireUiTextArea', function () {
    function adjust ( scope, element ) {
        var area = element.children('#area');
        var areaEL = area[0];

        // NOTE: this will make sure the scrollHeight calculate even we shrink it.
        areaEL.style.height = "0px";
        areaEL.style.height = areaEL.scrollHeight + "px";

        if ( areaEL.scrollWidth > areaEL.clientWidth &&
             areaEL.style.overflowX !== 'hidden' )
        {
            var scrollBarHeight = areaEL.offsetHeight - areaEL.clientHeight;
            areaEL.style.height = (areaEL.scrollHeight + scrollBarHeight) + "px";
        }
    } 

    function preLink ( scope, element, attrs ) {
        // init tabindex
        var area = element.children('#area');
        area[0].tabIndex = FIRE.getParentTabIndex(area[0])+1;
    }

    function postLink ( scope, element, attrs ) {
        var area = element.children('#area');
        area.val(scope.bind);
        adjust ( scope, element );

        // area
        area
        .on ( 'input', function (event) {
            scope.bind = area.val();
            scope.$apply();

            // adjust
            adjust ( scope, element );
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
                    adjust ( scope, element );
                    area.blur(); 
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
                var val = area.val();
                scope.bind = val;
                scope.$apply();
                area.val(val);
                adjust ( scope, element );

                element.removeClass('focused');
            }
        })
        ;

        // scope
        scope.$watch ( 'bind', function ( val, old ) {
            area.val(val);
            adjust ( scope, element );
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