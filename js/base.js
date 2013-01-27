var $$ = function (id) {
    return document.getElementById(id);
};

var base = {};
base.ui = {};

base.ui.ce = function (e, a) {
    e = e || 'div';
    a = a || {};
    var t = document.createElement(e),
        s = {innerHTML: 'innerHTML', textContent: 'textContent'},
        i;
    for (i in a) {
        if (a.hasOwnProperty(i)) {
            if (s.hasOwnProperty(i)) {
                t[s[i]] = a[i];
            } else {
                t.setAttribute(i, a[i]);
            }
        }
    }
    return t;
};

base.ui.cdf = function () {
    return document.createDocumentFragment();
};