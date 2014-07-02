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
    function compileLabelEL ( scope, classList ) {
        var el = "<fire-ui-label id='label' class=" + "'" + classList + "'" + ">{{name}}</fire-ui-label>";
        return $compile(el)( scope );
    }

    function preLink ( scope, element, attrs ) {
        // // init tabindex
        // element[0].tabIndex = FIRE.getParentTabIndex(element[0])+1;
    }

    function postLink (scope, element, attrs) {
        // do dom transform
        var typename = typeof scope.value;

        // NOTE: if we write the fire-ui-label html codes directly in field.html, we can not
        // get compiled labelEL here through element.find('#label').
        var labelEL = null;
        var fieldEL = null;

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
                    labelEL = compileLabelEL(scope,'flex-1');
                    fieldEL = $compile( "<fire-ui-select class='flex-2' fi-value='value' fi-options='finalEnumList'></fire-ui-select>" )( scope );      
                }
                else if ( scope.type === 'int' ) {
                    labelEL = compileLabelEL(scope,'flex-1');
                    fieldEL = $compile( "<fire-ui-unit-input class='flex-2' fi-type='int' fi-value='value'></fire-ui-unit-input>" )( scope );
                }
                else if ( scope.type === 'float' ) {
                    labelEL = compileLabelEL(scope,'flex-1');
                    fieldEL = $compile( "<fire-ui-unit-input class='flex-2' fi-type='float' fi-value='value'></fire-ui-unit-input>" )( scope );
                }
                break;

            case "boolean":
                labelEL = compileLabelEL(scope,'flex-1');
                fieldEL = $compile( "<fire-ui-checkbox class='flex-2' fi-value='value'></fire-ui-checkbox>" )( scope );
                break;

            case "string":
                if ( scope.textMode === 'single' ) {
                    labelEL = compileLabelEL(scope,'flex-1');
                    fieldEL = $compile( "<fire-ui-text-input class='flex-2' fi-value='value'></fire-ui-text-input>" )( scope );
                }
                else if ( scope.textMode === 'multi' ) {
                    labelEL = compileLabelEL(scope,'flex-1 flex-align-self-start');
                    fieldEL = $compile( "<fire-ui-text-area class='flex-2' fi-value='value'></fire-ui-text-area>" )( scope );
                }
                break;

            case "object":
                if ( Array.isArray(scope.value) ) {
                    // TODO
                }
                else {
                    var className = FIRE.getClassName(scope.value);
                    switch ( className ) {
                        case "FIRE.Color":
                            labelEL = compileLabelEL(scope,'flex-1');
                            fieldEL = $compile( "<fire-ui-color class='flex-2' fi-value='value'></fire-ui-color>" )( scope );
                            break;

                        case "FIRE.Vec2":
                            labelEL = compileLabelEL(scope,'flex-1');
                            fieldEL = $compile( "<fire-ui-vec2 class='flex-2' fi-value='value'></fire-ui-vec2>" )( scope );
                            break;
                    }
                }
                break;
        }

        //
        element.append(labelEL);
        element.append("<span class='space'></span>");
        element.append(fieldEL);

        // element
        element
        .on('focusin', function(event) {
            element.addClass('focused');
            labelEL.addClass('focused');
            fieldEL.addClass('focused');
        })
        .on('focusout', function(event) {
            if ( element.hasClass('focused') === false )
                return;

            //
            if ( element.find( event.relatedTarget ).length )
                return;
            
            element.removeClass('focused');
            labelEL.removeClass('focused');
            fieldEL.removeClass('focused');
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
        attrs.fiName = (attrs.fiName!==undefined) ? attrs.fiName : FIRE.camelCaseToHuman(attrs.fiValue);
        attrs.fiType = (attrs.fiType!==undefined) ? attrs.fiType : 'int';
        attrs.fiEnumType = (attrs.fiEnumType!==undefined) ? attrs.fiEnumType : '';
        attrs.fiTextMode = (attrs.fiTextMode!==undefined) ? attrs.fiTextMode : 'single';

        return {
            pre: preLink,
            post: postLink,
        };
    }

    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '=fiValue',
            name: '@fiName',
            type: '@fiType',
            enumType: '@fiEnumType',
            enumList: '=fiEnumList',
            textMode: '@fiTextMode',
        },
        templateUrl: 'field/field.html',
        compile: compile,
    };
}]);
