angular.module("fireUI.dropdown", [] )
.directive( 'fireUiDropdown', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'dropdown/dropdown.html',
        link: function (scope, element, attrs) {
            var menu = element.children('.menu');
            element
            .on ( 'click', function () {
                if ( menu.length !== 0 ) {
                    if ( menu.hasClass('hide') ) {
                        menu.removeClass('hide');
                    }
                    else {
                        menu.addClass('hide');
                    }
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
        },
    };
});
