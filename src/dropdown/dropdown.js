angular.module("fireUI.dropdown", [] )
.directive( 'fireUiDropdown', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            bind: '=fiBind',
        },
        templateUrl: 'dropdown/dropdown.html',
        link: function (scope, element, attrs) {
            var menu = element.children('.menu');
            element
            .on ( 'click', function () {
                if ( menu.length !== 0 ) {
                    menu.toggleClass('hide');
                }
                else {
                    console.log('.menu not found');
                }
            })
            .on ( 'focusout', function () {
                if ( menu.length !== 0 ) {
                    if ( menu.hasClass('hide') === false ) {
                        menu.addClass('hide');
                    }
                }
            })
            ;

            // bind click event to ng-repeated element
            var stopWatch = scope.$watch(menu.children(), function() {
                var item = menu.children('.item');
                if (item.length !== 0) {
                    item.on ( 'click', function (e) {
                        if (e.target) {
                            scope.bind = e.target.innerHTML;
                            scope.$apply();
                        }
                    });
                }
                else {
                    console.log('.item not found');
                }
                stopWatch();
            });
        },
    };
});
