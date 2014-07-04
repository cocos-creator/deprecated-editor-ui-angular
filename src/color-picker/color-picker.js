angular.module("fireUI.colorPicker", [
    "fireUI.unitInput",
] )
.directive( 'fireUiColorPicker', function () {
    function preLink ( scope, element, attrs ) {
        // init tabindex
        element[0].tabIndex = FIRE.getParentTabIndex(element[0])+1;
    }

    function postLink ( scope, element, attrs ) {
        scope.hsv = scope.value.toHSV();
        scope.rgb = {
            r: scope.value.r * 255 | 0 ,
            g: scope.value.g * 255 | 0 ,
            b: scope.value.b * 255 | 0 ,
        };
        var editingHSV = false;

        var huePanel = element.find("#hue");
        var hueHandle = element.find("#hue-handle");
        var colorPanel = element.find("#color");
        var colorHandle = element.find("#color-handle");
        var opacityPanel = element.find("#opacity");
        var opacityHandle = element.find("#opacity-handle");

        var updateColor = function () {
            var cssRGB = FIRE.hsv2rgb( scope.hsv.h, 1, 1 );
            cssRGB = "rgb("+ (cssRGB.r*255|0) + "," + (cssRGB.g*255|0) + "," + (cssRGB.b*255|0) + ")";
            colorPanel.css( "background-color", cssRGB );
            opacityPanel.css( "background-color", cssRGB );
            opacityHandle.css( "top", (1.0-scope.value.a)*100 + "%" );

            hueHandle.css( "top", (1.0-scope.hsv.h)*100 + "%" );
            colorHandle.css({
                left: scope.hsv.s*100 + "%",
                top: (1.0-scope.hsv.v)*100 + "%"
            });
        };

        updateColor();

        // scope
        scope.$watchGroup ( [
            'rgb.r', 
            'rgb.g', 
            'rgb.b', 
        ], function ( val, old ) {
            scope.value.r = val[0]/255;
            scope.value.g = val[1]/255;
            scope.value.b = val[2]/255;
        }); 

        scope.$watchGroup ( [
            'value.r', 
            'value.g', 
            'value.b', 
        ], function ( val, old ) {
            scope.rgb = {
                r: scope.value.r * 255 | 0,
                g: scope.value.g * 255 | 0,
                b: scope.value.b * 255 | 0,
            };
            if ( !editingHSV ) {
                scope.hsv = FIRE.rgb2hsv( val[0], val[1], val[2] );
                updateColor();
            }
        }); 

        scope.$watch ( 'value.a', function () {
            updateColor();
        });

        scope.$on('$destroy', function () {
            huePanel.off();
            colorPanel.off();
        });

        // hue
        huePanel.on ( 'mousedown', function ( event ) {
            // add drag-ghost
            FIRE.addDragGhost("crosshair");
            editingHSV = true;

            var mouseDownY = $(this).offset().top;
            var updateMouseMove = function (event) {
                var offsetY = (event.pageY - mouseDownY)/huePanel.height();
                offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.001 );

                scope.hsv.h = 1.0-offsetY;
                updateColor();
                scope.$apply( function () {
                    var h = Math.round( scope.hsv.h * 100.0 )/100.0;
                    scope.value.fromHSV( h, scope.hsv.s, scope.hsv.v );
                });
            };
            updateMouseMove(event);

            $(document).on ( 'mousemove', function ( event ) {
                updateMouseMove(event);
                return false;
            });
            $(document).on ( 'mouseup', function ( event ) {
                $(document).off ( 'mousemove' );
                $(document).off ( 'mouseup' );
                FIRE.removeDragGhost();
                editingHSV = false;
                return false;
            });

            return false;
        })
        ;

        // color 
        colorPanel.on ( 'mousedown', function ( event ) {
            // add drag-ghost
            FIRE.addDragGhost("crosshair");
            editingHSV = true;

            var mouseDownX = $(this).offset().left;
            var mouseDownY = $(this).offset().top;

            var updateMouseMove = function (event) {
                var offsetX = (event.pageX - mouseDownX)/colorPanel.width();
                var offsetY = (event.pageY - mouseDownY)/colorPanel.height();

                offsetX = Math.max( Math.min( offsetX, 1.0 ), 0.0 );
                offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.0 );

                scope.hsv.s = offsetX;
                scope.hsv.v = 1.0-offsetY;
                updateColor();
                scope.$apply( function () {
                    var h = Math.round( scope.hsv.h * 100.0 )/100.0;
                    scope.value.fromHSV( h, scope.hsv.s, scope.hsv.v );
                });
            };
            updateMouseMove(event);

            $(document).on ( 'mousemove', function ( event ) {
                updateMouseMove(event);
            });
            $(document).on ( 'mouseup', function ( event ) {
                $(document).off ( 'mousemove' );
                $(document).off ( 'mouseup' );
                FIRE.removeDragGhost ();
                editingHSV = false;
                return false;
            });

            return false;
        })
        ;

        // alpha
        opacityPanel.on ( 'mousedown', function ( event ) {
            // add drag-ghost
            FIRE.addDragGhost("crosshair");

            var mouseDownY = $(this).offset().top;
            var updateMouseMove = function (event) {
                var offsetY = (event.pageY - mouseDownY)/opacityPanel.height();
                offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.0 );

                scope.$apply( function () {
                    scope.value.a = 1.0-offsetY;
                });
            };
            updateMouseMove(event);

            $(document).on ( 'mousemove', function ( event ) {
                updateMouseMove(event);
                return false;
            });
            $(document).on ( 'mouseup', function ( event ) {
                $(document).off ( 'mousemove' );
                $(document).off ( 'mouseup' );
                FIRE.removeDragGhost ();
                return false;
            });

            return false;
        })
        ;
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
            value: '=fiValue',
        },
        templateUrl: 'color-picker/color-picker.html',
        compile: compile,
    };
});
