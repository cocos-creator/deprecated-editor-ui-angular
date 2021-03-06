angular.module("fireUI.customField", [] )
.directive( 'fireUiCustomField', ['$compile', function ( $compile ) {
    function preLink ( scope, element, attrs ) {
        // // init tabindex
        // element[0].tabIndex = FIRE.getParentTabIndex(element[0])+1;
    }

    function postLink (scope, element, attrs) {
        element.prepend("<span class='space'></span>");

        // NOTE: if we write the fire-ui-label html codes directly in field.html, we can not
        // get compiled labelEL here through element.find('#label').
        var labelEL = $compile( "<fire-ui-label id='label' class='flex-1'>{{name}}</fire-ui-label>" )( scope );
        element.prepend(labelEL);

        // element
        element
        .on('focusin', function(event) {
            element.addClass('focused');
            labelEL.addClass('focused');
        })
        .on('focusout', function(event) {
            if ( element.hasClass('focused') === false )
                return;
            //
            if ( element.find( event.relatedTarget ).length )
                return;
            
            element.removeClass('focused');
            labelEL.removeClass('focused');
        })
        .on('mousedown', function(event) {
            if ( element.is(event.target) === false &&
                 labelEL.is(event.target) === false && 
                 labelEL.find(event.target).length === 0 )
                return;

            var focusableEL = FIRE.getFirstFocusableChild(element[0]);
            if ( focusableEL ) {
                focusableEL.focus();
            }

            event.preventDefault();
            return false;
        })
        ;
    }

    function compile ( element, attrs ) {
        attrs.fiName = (attrs.fiName!==undefined) ? attrs.fiName : FIRE.camelCaseToHuman(attrs.fiBind);
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
            name: '@fiName',
        },
        templateUrl: 'custom-field/custom-field.html',
        compile: compile,
    };
}]);
