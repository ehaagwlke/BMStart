var	mostvisited = {};

//define how many items to be shown
mostvisited.showNum = function(){
	var width = document.body.clientWidth, 
		max = width < 1440 ? 10 : 16;
	return max;
}


//Gen html for a site object;
//param: o should be a object.
mostvisited.genSiteNode = function(o){
    if(!o){return;}
    
    var url = o.url,
        title = o.title ? o.title : o.url,
        node;
    
    var	img = base.ui.ce('img',{src:'chrome://favicon/'+url}),			
        link = base.ui.ce('a',{href:url, title:title}),
        node = base.ui.ce(mostvisited.siteNodeTag);
        
        link.appendChild(img);
        link.innerHTML += title;

        node.appendChild(link);
        
    return node;
};

//insert all nodes into the page
mostvisited.show = function(o){
	var c = mostvisited.containerId || 'topSitesLinks',
		t = document.getElementById(c),
		l = o.length,
		i = 0;        
        
	if(0 === l){
		t.setAttribute('style','display:hidden');
	}else{
		t.setAttribute('style','display:');
        document.getElementById(mostvisited.titleContainerId).textContent = mostvisited.titleStr;
        
        var max = mostvisited.showNum();
        l < max ? max = l : max = max;
        
        for(i; i<max; i++){
            t.appendChild(mostvisited.genSiteNode(o[i]));
        }
	}
}

/*
TODO:Gen thumbnail of topSite.
     Actually, the function for
     generating the thumbnail of
     a specific site has already
     been finished.

//Gen Thumbnail of a page
mostvisited.genThumbnail = function(url){
    if(!url){
        return;
    }
    var u = url;
    
    chrome.tabs.onUpdated.addListener(function(tid,info,tab){
        if(info.status === "complete"){
            if(tab.url.indexOf(u)===0){
                chrome.tabs.query({windowType:"normal"},function(ta){
                    if(!ta.length){
                        return;
                    }
                    
                    var t = ta[0],
                        tid = t.id,
                        wid = t.windowId;
                        
                    chrome.tabs.captureVisibleTab(wid, {format:"png"}, function(du){
                        localStorage[url] = du;
                        return du;
                    });
                   
                });
            }
        }
    }); 
}


mostvisited.showThumb = function(o){
    if(!o) return;
    
    var u = o.url;
    
    if(!localStorage[u]){
        mostvisited.genThumbnail(u);
    }else{
        mostvisited.genThumbCon(o);
    }
}

mostvisited.genThumbCon = function(o){
    
}
*/


mostvisited.init = function(){
	chrome.topSites.get(function(m){
		mostvisited.show(m);
	});
};
