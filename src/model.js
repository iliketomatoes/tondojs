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

        delta = this.target.offsetHeight - sideLength;
        
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
