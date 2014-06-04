angular.module("fireUI.colorPicker", [] )
.directive( 'fireUiColorPicker', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            color: '=fiColor',
        },
        templateUrl: 'color-picker/color-picker.html',
        link: function ( scope, element, attrs ) {
            scope.rgb = {
                r: scope.color.r * 255,
                g: scope.color.g * 255,
                b: scope.color.b * 255,
            };
            scope.alpha = scope.color.a;

            var huePanel = element.find("#hue");
            var hueHandle = element.find("#hue-handle");
            var colorPanel = element.find("#color");
            var colorHandle = element.find("#color-handle");
            var opacityPanel = element.find("#opacity");
            var opacityHandle = element.find("#opacity-handle");

            var updateColor = function () {
                colorPanel.css( "background-color", scope.color.toCSS("rgb") );
                opacityPanel.css( "background-color", scope.color.toCSS("rgb") );
                opacityHandle.css( "top", Math.floor((1.0-scope.color.a) * 100).toString() + "%" );

                var hsb = scope.color.toHSB();
                hueHandle.css( "top", parseInt((1.0-hsb.h/360)*100,10) + "%" );
                colorHandle.css({
                    left: parseInt(hsb.s,10) + "%",
                    top: parseInt((100-hsb.b),10) + "%"
                });
            };

            updateColor();

            // scope
            scope.$watchGroup ( [
                'color.r', 
                'color.g', 
                'color.b', 
                'color.a'
            ], function ( val, old ) {
                scope.rgb = {
                    r: scope.color.r * 255,
                    g: scope.color.g * 255,
                    b: scope.color.b * 255,
                };
                scope.alpha = scope.color.a;

                updateColor();
            }); 

            scope.$watchGroup ( [
                'rgb.r', 
                'rgb.g', 
                'rgb.b', 
                'alpha'
            ], function ( val, old ) {
                scope.color.r = scope.rgb.r/255; 
                scope.color.g = scope.rgb.g/255; 
                scope.color.b = scope.rgb.b/255; 
                scope.color.a = scope.alpha; 

                updateColor();
            }); 

            scope.$on('$destroy', function () {
                huePanel.off();
            });

            // hue
            huePanel.on ( 'mousedown', function ( event ) {
                // add drag-ghost
                var dragGhost = $("<div></div>")
                .addClass("drag-ghost")
                .css({
                    position: "fixed",
                    "z-index": "999",
                    left: "0",
                    top: "0",
                    width: $(window).width() + "px",
                    height: $(window).height() + "px",
                    cursor: "crosshair",
                })
                ;
                $(document.body).append(dragGhost);
                var mouseDownY = $(this).offset().top;
                var offsetY = (event.pageY - mouseDownY)/huePanel.height();
                offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.0 );

                var hsb = scope.color.toHSB();
                hsb.h = (1.0 - offsetY) * 360.0;
                scope.color.fromHSB(hsb.h, hsb.s, hsb.b);
                scope.$apply();

                $(document).on ( 'mousemove', function ( event ) {
                    var offsetY = (event.pageY - mouseDownY)/huePanel.height();
                    offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.0 );

                    var hsb = scope.color.toHSB();
                    hsb.h = (1.0 - offsetY) * 360.0;
                    scope.color.fromHSB(hsb.h, hsb.s, hsb.b);
                    scope.$apply();

                    return false;
                });
                $(document).on ( 'mouseup', function ( event ) {
                    $(document).off ( 'mousemove' );
                    $(document).off ( 'mouseup' );
                    dragGhost.css('cursor', 'auto');
                    dragGhost.remove();
                    return false;
                });
            })
            ;
        },
    };
});
