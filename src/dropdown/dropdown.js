angular.module("fireUI.dropdown", [] )
.directive( 'fireUiDropdown', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            bind: '=fiBind',
            options: '=fiOptions',
        },
        templateUrl: 'dropdown/dropdown.html',
        link: function (scope, element, attrs) {
            var menu = element.children('.menu');

            element
            .on ( 'click', function () {
                menu.toggleClass('hide');
            })
            .on ( 'focusout', function () {
                menu.addClass('hide');
            })
            ;

            //
            scope.onSelect = function ( idx, event ) {
                var opt = scope.options[idx];
                scope.bind = opt.value;
                scope.updateSelected(idx);

                menu.addClass('hide');
                event.stopPropagation();
            };
            scope.updateSelected = function ( idx ) {
                var items = menu.children('.item');
                items.each( function ( index ) {
                    if ( index === idx ) {
                        $(this).addClass("selected");
                    }
                    else {
                        $(this).removeClass("selected");
                    }
                } );
            };
        },
    };
});
