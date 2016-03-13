/*! tondo.js - v0.0.1 - 2016-03-13
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

function describeArc(x, y, radius, arcSweep) {

    var d = [
        'M', (x - 1), y,
        'a', radius, radius, 0, 1, arcSweep, 1, 0
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

var TondoModel = {
    init: function() {
        this.proxy.targetWidth = this.getTargetWidth();
        this.proxy.gap = this.getBiggestGap();
        this.setLayout();
    },
    /**
     * @return {Number}
     */
    getTargetWidth: function() {
    	var targetHeight = this.target.clientHeight;
    	var targetWidth = this.target.clientWidth;
        return targetHeight <= targetWidth ? targetHeight : targetWidth;
    },
    /**
     * @param {Number}
     * @return {Number}
     */
    getRadius: function(gap) {
        return (this.proxy.targetWidth / 2) + gap;
    },
    /**
     * @return {Number}
     */
    getBiggestGap: function (){
    	var biggestGap = 0;
    	var circles = this.settings.circles;

        for(var i in circles) { 
        	if(circles[i].gap > biggestGap) biggestGap = circles[i].gap;
        }

        return biggestGap;
    },
    setLayout: function() {

    	var circles, 
    		targetWidth, 
    		sideLength,
    		d,
    		svgURI,
    		xLinkNS,
    		svgEl,
    		delta,
    		viewBox,
    		defs;

    	circles = this.settings.circles;
    	
    	targetWidth = this.proxy.targetWidth;

        sideLength = targetWidth + (this.proxy.gap * 2);
        
        d = document.createDocumentFragment();

        // SVG namespace
        svgURI = 'http://www.w3.org/2000/svg';
        xLinkNS = 'http://www.w3.org/1999/xlink';

        svgEl = document.createElementNS(svgURI, 'svg');

        svgEl.setAttribute('class', this.settings.classes);

        svgEl.setAttribute('width', sideLength);
        svgEl.setAttribute('height', sideLength);
        svgEl.setAttribute('data-tondo-id', this.GUID);

        delta = this.target.parentNode.clientHeight - sideLength;
        
        svgEl.style.left = (delta / 2) + this.target.offsetLeft + 'px';
        svgEl.style.top = (delta / 2) + this.target.offsetTop + 'px';

        // SVG attributes, like viewBox, are camelCased. That threw me for a loop
        viewBox = [0, 0, sideLength, sideLength].join(' ');
        svgEl.setAttribute('viewBox', viewBox);

        defs = document.createElementNS(svgURI, 'defs');

        for(var j in circles) {

        	var radius,
        		ID,
        		circlePath,
        		g,
        		use,
        		textPath,
        		content,
        		text;

        	radius = circles[j].radius || this.getRadius(circles[j].gap);
        	ID = this.GUID + '_' + j + '_' + circles[j].side;

        	circlePath = document.createElementNS(svgURI, 'path');
        	circlePath.setAttribute('id', ID);
        	if(circles[j].side === 'up') {
		        circlePath.setAttribute('d', describeArc((sideLength / 2), sideLength - (this.proxy.gap - circles[j].gap), radius, 1));
        	} else {
        		// Such an empirical forumula :-)
        		var adjustY = ((sideLength - (2*radius)) - this.proxy.gap + circles[j].gap);
        		console.log(adjustY);
        		circlePath.setAttribute('d', describeArc((sideLength / 2), adjustY, radius, 0));
        	}

        	defs.appendChild(circlePath);

	        // Set a new group
	        g = document.createElementNS(svgURI, 'g');

	        use = document.createElementNS(svgURI, 'use');
	        use.setAttributeNS(xLinkNS ,'href', '#' + ID);
	        g.appendChild(use);

	        // Set text
	        textPath = document.createElementNS(svgURI, 'textPath');
	        textPath.setAttributeNS( xLinkNS,'href', '#' + ID);
	        textPath.setAttribute('startOffset', '50%');
	        textPath.setAttribute('text-anchor', 'middle');
	       
	        content = circles[j].text;

	        textPath.textContent = content;

	        text = document.createElementNS(svgURI, 'text');

	        text.appendChild(textPath);

	        g.appendChild(text);	       

	        svgEl.appendChild(defs);
	        svgEl.appendChild(g);
        }

        d.appendChild(svgEl);

        this.target.parentNode.appendChild(d);
    }
};

function Tondo(selector, options) {

    var _defaults = {
        classes: ''
    };

    var _createInstance = function(targetEl, GUID, options) {
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
