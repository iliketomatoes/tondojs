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
        GUID = generateGUID();
        if (!settings) settings = _extendElementDataAttributes(targetElements[i]);
        Instances[GUID] = _createInstance(targetElements[i], GUID, settings);
        Instances[GUID].init();
        this.instances.push(GUID);
        i++;
    }
}
