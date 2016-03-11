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
