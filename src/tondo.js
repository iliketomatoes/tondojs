function Tondo(selector, options) {

    var _defaults = {
        defaultClass: 'tondo',
        customClass: '',
        tondoUp: {
            text: '',
            gap: 5,
            side: 'up',
            startOffset: '50%',
            textAnchor: 'middle',
            textPathClass: '',
            fontSize: '',
        },
        tondoDown: {
            text: '',
            gap: 0,
            side: 'down',
            startOffset: '50%',
            textAnchor: 'middle',
            textPathClass: '',
            fontSize: ''
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
