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
