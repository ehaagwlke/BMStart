var $$ = function(id){
	return document.getElementById(id);
}

var base = {};
	base.ui = {};

base.ui.ce = function(e,a){
	var e = e || 'div',
		a = a || {};
	
	var t = document.createElement(e),
		s = {innerHTML:'innerHTML',textContent:'textContent', style:'style'};
	
	for(var i in a){
        if(!a.hasOwnProperty(i)){
            continue;
        }
        if(i in s){
            t[s[i]] = a[i];
        }else{
            t.setAttribute(i, a[i]);
        }
	}
	return t;
}

base.ui.cdf = function(){
	return document.createDocumentFragment();
}