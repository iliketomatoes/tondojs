/*! tondo.js - v0.0.1 - 2016-03-12
* https://github.com/iliketomatoes/tondojs
* Copyright (c) 2016 ; Licensed  */
(function(window, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // Register Tondo as an AMD module
        define(factory());

    } else if (typeof module == 'object' && module.exports) {
        // Register Tondo for CommonJS
        module.exports = factory();

    } else {
        // Register Tondo on window
        window.Tondo = factory();
    }

})(window, function() {

'use strict';

// Object storing TondoModel instances
var Instances = {};

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

function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

/**
 * http://stackoverflow.com/a/2117523
 *
 * Generate a random GUID that will be used as the key to retrieve
 * all the Slider instances inside the Instances object.
 * @return {String}
 */
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

var ARC_START_ANGLE = 0.01;
var ARC_END_ANGLE = 360;

var TondoModel = {
    init: function() {
        this.proxy.targetWidth = this.getTargetWidth();
        this.setLayout();
        this.setTextOffset();
    },
    /**
     * @return {Number}
     */
    getTargetWidth: function() {
    	var targetHeight = this.target.clientHeight;
    	var targetWidth = this.target.clientWidth;
        return targetHeight <= targetWidth ? targetHeight : targetWidth;
    },
    getRadius: function(gap) {
        return (this.proxy.targetWidth / 2) + gap;
    },
    setLayout: function() {
    	var circles = this.settings.circles;
    	
    	var targetWidth = this.proxy.targetWidth;
        var biggestGap = 0;

        for(var i in circles) { 
        	if(circles[i].gap > biggestGap) biggestGap = circles[i].gap;
        }

        var sideLength = targetWidth + (biggestGap * 2);
        
        var d = document.createDocumentFragment();

        // SVG namespace
        var svgURI = 'http://www.w3.org/2000/svg';
        var xLinkNS = 'http://www.w3.org/1999/xlink';

        var svgEl = document.createElementNS(svgURI, 'svg');

        svgEl.setAttribute('class', this.settings.classes);

        svgEl.setAttribute('width', sideLength);
        svgEl.setAttribute('height', sideLength);
        svgEl.setAttribute('data-tondo-id', this.GUID);

        var delta = this.target.parentNode.clientHeight - sideLength;

        svgEl.style.left = (delta / 2) + this.target.offsetLeft + 'px';
        svgEl.style.top = (delta / 2) + this.target.offsetTop + 'px';

        // SVG attributes, like viewBox, are camelCased. That threw me for a loop
        var viewBox = [0, 0, sideLength, sideLength].join(' ');
        svgEl.setAttribute('viewBox', viewBox);

        var defs = document.createElementNS(svgURI, 'defs');

        for(var j in circles) {

        	var radius = circles[j].radius || this.getRadius(circles[j].gap);
        	var ID = this.GUID + '_' + j + '_' + circles[j].side;

        	var circlePath = document.createElementNS(svgURI, 'path');
        	circlePath.setAttribute('id', ID);
        	if(circles[j].side === 'up') {
		        circlePath.setAttribute('d', describeCircle((sideLength / 2), (sideLength / 2), radius));
        	} else {
        		circlePath.setAttribute('d', describeArc((sideLength / 2), (sideLength / 2), radius, ARC_START_ANGLE, ARC_END_ANGLE));
        	}

        	defs.appendChild(circlePath);

	        // Set a new group
	        var g = document.createElementNS(svgURI, 'g');

	        var use = document.createElementNS(svgURI, 'use');
	        use.setAttributeNS(xLinkNS ,'href', '#' + ID);
	        g.appendChild(use);

	        // Set text
	        var textPath = document.createElementNS(svgURI, 'textPath');
	        textPath.setAttributeNS( xLinkNS,'href', '#' + ID);
	        if(circles[j].side !== 'up') {
	        	textPath.setAttribute('startOffset', '50%');
	        	textPath.setAttribute('text-anchor', 'middle');
	        }
	        var content = circles[j].text;

	        textPath.textContent = content;

	        var text = document.createElementNS(svgURI, 'text');
	        text.setAttribute('id', ID + '_text');

	        text.appendChild(textPath);

	        g.appendChild(text);	       

	        svgEl.appendChild(defs);
	        svgEl.appendChild(g);
        }

        d.appendChild(svgEl);

        this.target.parentNode.appendChild(d);
    },
    setTextOffset: function() {
    	var circles = this.settings.circles;
    	var svgEl = this.target.parentNode.querySelector('svg[data-tondo-id]');

    	for(var i in circles) {
    		if(circles[i].side === 'up') {
    			var radius = circles[i].radius || this.getRadius(circles[i].gap);
    			var ID = this.GUID + '_' + i + '_' + circles[i].side;

    			var textEl = svgEl.getElementById(ID + '_text');
    			
		    	var textPath = textEl.querySelector('textPath');
		    	var textLength = textEl.getComputedTextLength();

		    	var quarterOfArc = getCirclePerimeter(radius) / 4;
		    	var adjustedOffset = quarterOfArc - (textLength / 2);
		    	textPath.setAttribute('startOffset', adjustedOffset);
    		}
    	}
    }
};

function Tondo(selector, options) {

    var _defaults = {
        classes: ''
    };

    var _createInstance = function(targetEl, GUID, options) {
        console.log(targetEl);
        return Object.create(TondoModel, {
            target: {
                writable: false,
                value: targetEl
            },
            GUID: {
                writable: false,
                value: GUID
            },
            settings: {
                writable: true,
                value: options
            },
            proxy: {
                writable: true,
                value: {}
            }
        });
    };

    // Extend default options
    var settings = extend(_defaults, options);

    this.instances = [];

    var targetElements = document.querySelectorAll(selector);

    var i = 0;

    while (targetElements[i]) {
        var GUID = generateGUID();
        Instances[GUID] = _createInstance(targetElements[i], GUID, settings);
        Instances[GUID].init();
        this.instances.push(GUID);
        i++;
    }
}


return Tondo;
});
