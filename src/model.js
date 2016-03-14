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
        var biggestGap = 0;
        var circles = this.getCircles();

        for (var i in circles) {
            gap = circles[i].gap;
            if (circles[i].side === 'down') gap += parseFloat(circles[i].fontSize);
            console.log(gap);
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
            textPath.setAttribute('class', circles[j].textPathClass);

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
                radius = this.getRadius(circles[i].gap + parseFloat(circles[i].fontSize));
                // Such an empirical forumula :-)
                adjustY = (sideLength - (2 * radius));
                circlePath.setAttribute('d', describeArc((sideLength / 2), adjustY, radius, 0));
            }
        }

        svgEl.setAttribute('class', svgElClasses + ' tondo--loaded');
    }
};
