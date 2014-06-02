angular.module("fireUI.select", [] )
.directive( 'fireUiSelect', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '=fiBind',
            options: '=fiOptions',
        },
        templateUrl: 'select/select.html',
        link: function (scope, element, attrs) {
            var menu = element.children('.menu');

            var getValueName = function () {
                for ( var i = 0; i < scope.options.length; ++i ) {
                    var entry = scope.options[i];
                    if ( entry.value === scope.value ) {
                        return entry.name;
                    }
                }
            };
            scope.valueName = getValueName();

            //
            scope.onSelect = function ( event ) {
                var idx = parseInt(event.target.getAttribute('index'));
                var entry = scope.options[idx];
                scope.value = entry.value;
                scope.valueName = entry.name;

                menu.addClass('hide');
                event.stopPropagation();
            };

            //
            element
            .on ( 'click', function () {
                menu.toggleClass('hide');
                scope.$apply();
            })
            .on ( 'focusout', function () {
                menu.addClass('hide');
                scope.$apply();
            })
            ;
        },
    };
});
