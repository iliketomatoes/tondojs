/*! tondo.js - v0.0.1 - 2016-03-10
* https://github.com/iliketomatoes/tondojs
* Copyright (c) 2016 ; Licensed  */
(function(window, document) {
    'use strict';


    // http://stackoverflow.com/a/18473154
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {

        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

        var d = [
            'M', start.x, start.y,
            'A', radius, radius, 0, arcSweep, 0, end.x, end.y
        ].join(' ');

        return d;
    }

    // http://stackoverflow.com/a/10477334
    function describeCircle(x, y, radius) {

        var rCommaR = radius + ',' + radius;
        var doubleRadius = radius * 2;

        var d = [
            'M', x, y,
            'm', -radius, 0,
            'a', rCommaR, '0 1,1', doubleRadius.toString().concat(',0'),
            'a', rCommaR, '0 1,1', (-doubleRadius).toString().concat(',0')
        ].join(' ');

        return d;
    }

    function getCirclePerimeter(radius) {
        return 2 * Math.PI * radius;
    }

    function getStretchingFacor(radius) {
        return 1.45;
    }

    var Tondo = {
        init: function() {
            var path = document.getElementById('test-path');
            path.setAttribute('d', describeArc(150, 150, 100, 0.01, 360));


            var circlePath = document.getElementById('circlePath');
            circlePath.setAttribute('d', describeCircle(150, 150, 110));

            var textTags = document.getElementsByTagName('text');

            Array.prototype.slice.call(textTags).forEach(function(textEl, index) {

                if (index > 0) {
                    var textLength = textEl.getComputedTextLength();
                    var textPath = textEl.querySelector('textPath');
                    var quarterOfArc = getCirclePerimeter(110) / 4;
                    var adjustedOffset = quarterOfArc - (textLength / 2);

                    console.log(textEl.getComputedTextLength());
                    console.log(adjustedOffset);
                    textPath.setAttribute('startOffset', adjustedOffset);
                }

            });

        }
    };

    window.Tondo = Tondo;

})(window, document);
