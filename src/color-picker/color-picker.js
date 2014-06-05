angular.module("fireUI.colorPicker", [] )
.directive( 'fireUiColorPicker', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            hsv: '=fiHsv',
            alpha: '=fiAlpha',
        },
        templateUrl: 'color-picker/color-picker.html',
        link: function ( scope, element, attrs ) {
            var _rgb = FIRE.hsv2rgb(scope.hsv.h, scope.hsv.s, scope.hsv.v);
            var rgbUpdated = false;
            scope.rgb = {
                r: _rgb.r * 255 | 0 ,
                g: _rgb.g * 255 | 0 ,
                b: _rgb.b * 255 | 0 ,
            };

            var huePanel = element.find("#hue");
            var hueHandle = element.find("#hue-handle");
            var colorPanel = element.find("#color");
            var colorHandle = element.find("#color-handle");
            var opacityPanel = element.find("#opacity");
            var opacityHandle = element.find("#opacity-handle");

            var updateColor = function () {
                var cssRGB = "rgb(" + scope.rgb.r + "," + scope.rgb.g + "," + scope.rgb.b + ")";
                colorPanel.css( "background-color", cssRGB );
                opacityPanel.css( "background-color", cssRGB );
                opacityHandle.css( "top", Math.floor((1.0-scope.alpha) * 100).toString() + "%" );

                hueHandle.css( "top", parseInt((1.0-scope.hsv.h/360)*100,10) + "%" );
                colorHandle.css({
                    left: parseInt(scope.hsv.s,10) + "%",
                    top: parseInt((100-scope.hsv.v),10) + "%"
                });
            };

            updateColor();

            // scope
            scope.$watchGroup ( [
                'hsv.h', 
                'hsv.s', 
                'hsv.v', 
            ], function ( val, old ) {
                var _rgb = FIRE.hsv2rgb(val[0], val[1], val[2]);
                scope.rgb = {
                    r: _rgb.r * 255 | 0,
                    g: _rgb.g * 255 | 0,
                    b: _rgb.b * 255 | 0,
                };
                updateColor();
            }); 

            scope.$watchGroup ( [
                'rgb.r', 
                'rgb.g', 
                'rgb.b', 
            ], function ( val, old ) {
                scope.hsv = FIRE.rgb2hsv( val[0]/255, val[1]/255, val[2]/255 );
                updateColor();
            }); 

            scope.$watch ( 'alpha', function () {
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

                scope.$apply( function () {
                    scope.hsv.h = (1.0 - offsetY) * 360.0;
                });

                $(document).on ( 'mousemove', function ( event ) {
                    var offsetY = (event.pageY - mouseDownY)/huePanel.height();
                    offsetY = Math.max( Math.min( offsetY, 1.0 ), 0.0 );

                    scope.$apply( function () {
                        scope.hsv.h = (1.0 - offsetY) * 360.0;
                    });

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
