angular.module("fireUI.field", [
    "fireUI.checkbox",
    "fireUI.color",
    "fireUI.colorPicker",
    "fireUI.label",
    "fireUI.select",
    "fireUI.unitInput",
] )
.directive( 'fireUiField', ['$compile', function ( $compile ) {

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
        compile: function(element, attrs) {
            function camelCaseToHuman ( text ) {
                var result = text.replace(/([A-Z])/g, ' $1');

                // remove first white-space
                if ( result.charAt(0) == ' ' ) {
                    result.slice(1);
                }

                // capitalize the first letter
                return result.charAt(0).toUpperCase() + result.slice(1);
            }
            attrs.fiName = (attrs.fiName!==undefined) ? attrs.fiName : camelCaseToHuman(attrs.fiBind);
            attrs.fiType = (attrs.fiType!==undefined) ? attrs.fiType : 'int';
            attrs.fiEnumType = (attrs.fiEnumType!==undefined) ? attrs.fiEnumType : '';

            return function postLink (scope, element, attrs) {
                // do dom transform
                var typename = typeof scope.bind;
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
                            el = $compile( "<fire-ui-unitinput class='flex-2' fi-type='int' fi-bind='bind'></fire-ui-unitinput>" )( scope );
                            element.append(el);
                        }
                        else if ( scope.type === 'float' ) {
                            el = $compile( "<fire-ui-unitinput class='flex-2' fi-type='float' fi-bind='bind'></fire-ui-unitinput>" )( scope );
                            element.append(el);
                        }
                        break;

                    case "boolean":
                        el = $compile( "<div class='flex-2'><fire-ui-checkbox fi-bind='bind'></fire-ui-unitinput></div>" )( scope );
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
                            }
                        }
                        break;
                }
            };
        },
    };
}]);
