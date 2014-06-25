angular.module("fireUI.field", [
    "fireUI.checkbox",
    "fireUI.color",
    "fireUI.colorPicker",
    "fireUI.label",
    "fireUI.select",
    "fireUI.unitInput",
    "fireUI.vec2",
] )
.directive( 'fireUiField', ['$compile', function ( $compile ) {
    function preLink ( scope, element, attrs ) {
        // // init tabindex
        // element[0].tabIndex = FIRE.getParentTabIndex(element[0])+1;
    }

    function postLink (scope, element, attrs) {
        // do dom transform
        var typename = typeof scope.bind;

        // NOTE: if we write the fire-ui-label html codes directly in field.html, we can not
        // get compiled labelEL here through element.find('#label').
        var labelEL = $compile( "<fire-ui-label id='label'>{{name}}</fire-ui-label>" )( scope );
        element.append(labelEL);
        element.append("<span class='space'></span>");

        var el = null;
        switch ( typename ) {
            case "number":
                if ( scope.type === 'enum' ) {
                    if ( scope.enumType !== undefined && scope.enumType !== '' ) {
                        var enumTypeDef = FIRE.getVarFrom(window,scope.enumType);
                        scope.finalEnumList = FIRE.getEnumList(enumTypeDef);
                    }
                    else {
                        scope.finalEnumList = scope.enumList.slice(0);
                    }
                    el = $compile( "<fire-ui-select class='flex-2' fi-bind='bind' fi-options='finalEnumList'></fire-ui-select>" )( scope );      
                    element.append(el);
                }
                else if ( scope.type === 'int' ) {
                    el = $compile( "<fire-ui-unit-input class='flex-2' fi-type='int' fi-bind='bind'></fire-ui-unit-input>" )( scope );
                    element.append(el);
                }
                else if ( scope.type === 'float' ) {
                    el = $compile( "<fire-ui-unit-input class='flex-2' fi-type='float' fi-bind='bind'></fire-ui-unit-input>" )( scope );
                    element.append(el);
                }
                break;

            case "boolean":
                el = $compile( "<fire-ui-checkbox class='flex-2' fi-bind='bind'></fire-ui-checkbox>" )( scope );
                element.append(el);
                break;

            case "string":
                // TODO
                break;

            case "object":
                if ( Array.isArray(scope.bind) ) {
                    // TODO
                }
                else {
                    var className = FIRE.getClassName(scope.bind);
                    switch ( className ) {
                        case "FIRE.Color":
                            el = $compile( "<fire-ui-color class='flex-2' fi-bind='bind'></fire-ui-color>" )( scope );
                            element.append(el);
                            break;

                        case "FIRE.Vec2":
                            el = $compile( "<fire-ui-vec2 class='flex-2' fi-bind='bind'></fire-ui-vec2>" )( scope );
                            element.append(el);
                            break;
                    }
                }
                break;
        }

        // element
        element
        .on('focusin', function(event) {
            element.addClass('focused');
            labelEL.addClass('focused');
            el.addClass('focused');
        })
        .on('focusout', function(event) {
            if ( element.hasClass('focused') === false )
                return;

            //
            if ( element.find( event.relatedTarget ).length === 0 ) {
                element.removeClass('focused');
                labelEL.removeClass('focused');
                el.removeClass('focused');
            }
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
        })
        ;
    }

    function compile ( element, attrs ) {
        attrs.fiName = (attrs.fiName!==undefined) ? attrs.fiName : FIRE.camelCaseToHuman(attrs.fiBind);
        attrs.fiType = (attrs.fiType!==undefined) ? attrs.fiType : 'int';
        attrs.fiEnumType = (attrs.fiEnumType!==undefined) ? attrs.fiEnumType : '';

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
            name: '@fiName',
            type: '@fiType',
            enumType: '@fiEnumType',
            enumList: '=fiEnumList',
        },
        templateUrl: 'field/field.html',
        compile: compile,
    };
}]);
