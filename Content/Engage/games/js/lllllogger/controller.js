document.body.onkeydown = function(e) {
    var keys = {
        40: 'down'
    };
    if (typeof keys[e.keyCode] != 'undefined') {
        if (keys[e.keyCode] == 'down') {
            fingerStrectch();
        }
    }
};
