angular.module("fireUI.draggable", [] )
.directive( 'fireUiDraggable', [ '$document', function ($document) {
    function link ( scope, element, attrs ) {
        var startX = 0, startY = 0, x = 0, y = 0;

        element.css({
            position: 'relative',
            cursor: 'pointer'
            // border: '1px solid red',
            // backgroundColor: 'lightgrey',
        });

        element.on('mousedown', function(event) {
            // Prevent default dragging of selected content
            event.preventDefault();
            startX = event.screenX - x;
            startY = event.screenY - y;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
            y = event.screenY - startY;
            x = event.screenX - startX;
            element.css({
                top: y + 'px',
                left:  x + 'px'
            });
        }

        function mouseup() {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
        }
    }

    return {
        restrict: 'A',
        link: link,
    };
}]);
