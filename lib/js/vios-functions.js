exports.openURLwithTarget = function ( url, target ) {
    var win = window.open(url, target);
    win.focus();
}
