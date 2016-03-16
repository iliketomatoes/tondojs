/*! tondo.js - v0.0.1 - 2016-03-16
* https://github.com/iliketomatoes/tondojs
* Copyright (c) 2016 ; Licensed  */
(function(window, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // Register Tondo as an AMD module
        define(factory);

    } else if (typeof module == 'object' && module.exports) {
        // Register Tondo for CommonJS
        module.exports = factory;

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
            if (typeof b[key] === 'object' && b[key] !== null) {
                a[key] = extend(a[key], b[key]);
            } else {
                a[key] = b[key];
            }
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

// https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}


function turnArrayStringMapIntoObject(target) {
    var kVArr,
        tmp;

    tmp = {};
    target.forEach(function(keyValue, index) {
        kVArr = keyValue.split(':');
        if (kVArr[0]) tmp[kVArr[0]] = eval(kVArr[1]);
    });
    return tmp;
}

var rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var TondoModel = {
    init: function() {
        this.setLayout();
        this.setTondo();
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
     * @return {Array of Objects}
     */
    getCircles: function() {
        return [this.settings.tondoUp, this.settings.tondoDown];
    },
    /**
     * @return {Number}
     */
    getBiggestGap: function() {
        var gap;
        var biggestGap = -Infinity;
        var circles = this.getCircles();

        for (var i in circles) {
            gap = circles[i].gap;
            if (circles[i].side === 'down') gap += parseFloat(circles[i].fontSize);
            if (gap > biggestGap) biggestGap = gap;
        }

        return biggestGap;
    },
    setLayout: function() {

        var circles,
            d,
            svgURI,
            xLinkNS,
            svgEl,
            svgElClasses,
            defs;

        circles = this.getCircles();

        d = document.createDocumentFragment();

        // SVG namespace
        svgURI = 'http://www.w3.org/2000/svg';
        xLinkNS = 'http://www.w3.org/1999/xlink';

        svgElClasses = this.settings.defaultClass + ' ' + this.settings.customClass;

        svgEl = document.createElementNS(svgURI, 'svg');

        svgEl.setAttribute('class', svgElClasses);
        svgEl.setAttribute('id', this.GUID);

        defs = document.createElementNS(svgURI, 'defs');

        for (var j in circles) {

            var circlePathID,
                textPathID,
                circlePath,
                g,
                use,
                textPath,
                content,
                text;

            circlePathID = this.GUID + '_' + j + '_' + circles[j].side + '_path';

            circlePath = document.createElementNS(svgURI, 'path');
            circlePath.setAttribute('id', circlePathID);

            defs.appendChild(circlePath);

            // Set a new group
            g = document.createElementNS(svgURI, 'g');

            use = document.createElementNS(svgURI, 'use');
            use.setAttributeNS(xLinkNS, 'href', '#' + circlePathID);
            g.appendChild(use);

            // Set text
            textPathID = this.GUID + '_' + j + '_' + circles[j].side + '_textPath';
            textPath = document.createElementNS(svgURI, 'textPath');
            textPath.setAttributeNS(xLinkNS, 'href', '#' + circlePathID);
            textPath.setAttribute('id', textPathID);
            textPath.setAttribute('startOffset', circles[j].startOffset);
            textPath.setAttribute('text-anchor', circles[j].textAnchor);
            textPath.setAttribute('letter-spacing', circles[j].letterSpacing);

            content = circles[j].text;

            textPath.textContent = content;

            text = document.createElementNS(svgURI, 'text');
            text.setAttribute('class', circles[j].textClass);

            text.appendChild(textPath);

            g.appendChild(text);

            svgEl.appendChild(defs);
            svgEl.appendChild(g);
        }

        d.appendChild(svgEl);

        this.target.parentNode.appendChild(d);
    },
    setTondo: function() {
        var svgEl,
            circles,
            svgElClasses,
            sideLength,
            viewBox,
            delta;

        svgEl = document.getElementById(this.GUID);
        circles = this.getCircles();
        svgElClasses = svgEl.getAttribute('class');

        for (var j in circles) {
            var textPathID,
                textPath;

            textPathID = this.GUID + '_' + j + '_' + circles[j].side + '_textPath';
            textPath = document.getElementById(textPathID);
            // Register the fontSize
            circles[j].fontSize = window.getComputedStyle(textPath, null).getPropertyValue('font-size');
        }

        // After we have registered the fontSize, we compute the biggest gap
        this.proxy.gap = this.getBiggestGap();
        this.proxy.targetWidth = this.getTargetWidth();
        sideLength = this.proxy.targetWidth + (this.proxy.gap * 2);


        svgEl.setAttribute('width', sideLength);
        svgEl.setAttribute('height', sideLength);

        delta = this.target.offsetHeight - sideLength;

        svgEl.style.left = (delta / 2) + this.target.offsetLeft + 'px';
        svgEl.style.top = (delta / 2) + this.target.offsetTop + 'px';

        // SVG attributes, like viewBox, are camelCased. That threw me for a loop
        viewBox = [0, 0, sideLength, sideLength].join(' ');
        svgEl.setAttribute('viewBox', viewBox);

        for (var i in circles) {
            var circlePathID,
                circlePath,
                radius;

            var adjustY = 0;

            circlePathID = this.GUID + '_' + i + '_' + circles[i].side + '_path';
            circlePath = document.getElementById(circlePathID);

            if (circles[i].side === 'up') {
                radius = this.getRadius(circles[i].gap);
                circlePath.setAttribute('d', describeArc((sideLength / 2), sideLength - (this.proxy.gap - circles[i].gap), radius, 1));
            } else {

                // Such an empirical forumula :-)
                if (circles[i].gap < 0) {
                    radius = this.getRadius(circles[i].gap);
                    adjustY = (sideLength - (2 * radius) - parseFloat(circles[i].fontSize));
                } else {
                    radius = this.getRadius(circles[i].gap + parseFloat(circles[i].fontSize));
                    adjustY = (sideLength - (2 * radius));
                }

                circlePath.setAttribute('d', describeArc((sideLength / 2), adjustY, radius, 0));
            }
        }

        svgEl.setAttribute('class', svgElClasses + ' tondo--loaded');
    }
};

function Tondo(selector, options) {

    var settings,
        targetElements,
        GUID,
        i;

    var _defaults = {
        defaultClass: 'tondo',
        customClass: '',
        tondoUp: {
            text: '',
            gap: 5,
            side: 'up',
            startOffset: '50%',
            textAnchor: 'middle',
            textClass: '',
            fontSize: '',
            letterSpacing: ''
        },
        tondoDown: {
            text: '',
            gap: 0,
            side: 'down',
            startOffset: '50%',
            textAnchor: 'middle',
            textClass: '',
            fontSize: '',
            letterSpacing: '',
        }
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

    var _extendElementDataAttributes = function(targetEl) {
        var tondoUp,
            tondoDown,
            evaluatedOptions,
            tondoUpData,
            tondoDownData,
            tmp;

        tmp = targetEl.dataset;
        evaluatedOptions = {};
        if (tmp.tondoUp) {
            tondoUpData = tmp.tondoUp.split(';');
            tondoUp = turnArrayStringMapIntoObject(tondoUpData);
            evaluatedOptions['tondoUp'] = tondoUp;
        }
        if (tmp.tondoDown) {
            tondoDownData = tmp.tondoDown.split(';');
            tondoDown = turnArrayStringMapIntoObject(tondoDownData);
            evaluatedOptions['tondoDown'] = tondoDown;
        }

        if (tmp.defaultClass) evaluatedOptions['defaultClass'] = tmp.defaultClass;
        if (tmp.customClass) evaluatedOptions['customClass'] = tmp.customClass;

        return extend(_defaults, evaluatedOptions);
    };

    this.instances = [];

    if (selector === '' || typeof selector === 'undefined') {
        targetElements = document.querySelectorAll('*[data-tondo]');
    } else {
        targetElements = document.querySelectorAll(selector);
    }

    // Extend settings, if options are passed
    settings = null;

    if (typeof options === 'object' && options !== null) {
        // Extend default options
        settings = extend(_defaults, options);
    }


    i = 0;

    while (targetElements[i]) {
        var tmpSettings = settings || _extendElementDataAttributes(targetElements[i]);
        GUID = generateGUID();
        Instances[GUID] = _createInstance(targetElements[i], GUID, tmpSettings);
        Instances[GUID].init();
        this.instances.push(GUID);
        i++;
    }
}

var Eventie = {
    init: function() {
        var debouncedCheck = debounce(this.checkTargetsSizeChange, 700);
        window.onresize = debouncedCheck;
    },
    checkTargetsSizeChange: function() {
        rAF(function() {
            for (var i in Instances) {
                Instances[i].setTondo();
            }
        });
    }
};

Eventie.init();

return Tondo;
});
