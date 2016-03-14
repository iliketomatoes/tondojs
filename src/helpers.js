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
        var context = this, args = arguments;
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

var rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;