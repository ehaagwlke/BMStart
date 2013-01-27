var mostvisited = {};
    mostvisited.view = {};
    mostvisited.data = {};

//define how many items to be shown
mostvisited.data.showNum = function(){
    var width = document.body.clientWidth, 
        max = width < 1440 ? 7 : 16;
    return max;
}

mostvisited.data.filter = {
    set: function(o){
        var key = mostvisited.view.config.blackListKey,
            ls = localStorage[key],
            url = o.url,
            blistObj = ls ? JSON.parse(ls) : {};

        blistObj[url] = o;
        localStorage[key] = JSON.stringify(blistObj);
    },
    get: function(url){
        var key = mostvisited.view.config.blackListKey,
            ls = localStorage[key],
            listObj = ls ? JSON.parse(ls) : null;
        if(url && listObj){
            return listObj[url];
        }else{
            return listObj;
        }
    }
};


//Gen html for a site object;
//param: o should be an object.
mostvisited.view.genSiteNode = function(o){
    if(!o){return;}
    
    var url = o.url,
        title = o.title ? o.title : o.url,
        index = o.index,
        node;
    
    var img = base.ui.ce('img',{src:'chrome://favicon/'+url}),            
        link = base.ui.ce('a',{href:url, title:title, class:'top-site'}),
        node = base.ui.ce(mostvisited.view.config.siteNodeTag, {'data-index': index}),
        removeSign = base.ui.ce('a', {textContent: 'x', class: 'remove-sign'});
        
        removeSign.onclick = function(){
            var msg = chrome.i18n.getMessage('deleteTopSiteConfirm'),
                confrm = confirm(msg);

            if(confrm){
                var siteObj = {},
                    url = this.previousSibling.getAttribute('href'),
                    title = this.previousSibling.getAttribute('title');

                siteObj['url'] = url;
                siteObj['title'] = title;

                mostvisited.data.filter.set(siteObj);
                var pnode = this.parentNode.parentNode;
                pnode.removeChild(this.parentNode);
            }
        }

        link.appendChild(img);
        link.innerHTML += title;

        node.appendChild(link);
        node.appendChild(removeSign);
        
    return node;
};

//insert all nodes into the page
mostvisited.view.show = function(o){
    var c = mostvisited.view.config.containerId || 'topSitesLinks',
        t = $$(c),
        i = 0,
        j = 0,
        fg = base.ui.cdf(),
        key = mostvisited.view.config.blackListKey,
        blackList = mostvisited.data.filter.get(),
        blurl = {};

    if(blackList){
        for(var url in blackList){
            blurl[url]=url;
        }
    }

    for(j; j<o.length; j++){
        if(o[j]['url'] in blurl){
            o.splice(j, 1);
        }
    }

    if(0 === o.length){
        t.setAttribute('style','display:hidden');
    }else{
        t.setAttribute('style','display:');
        $$(mostvisited.view.config.titleContainerId).textContent = mostvisited.view.config.titleStr;
        
        var max = mostvisited.data.showNum();
            o.length < max ? max = o.length : max = max;
        
        for(i; i<max; i++){
            o[i]['index'] = i;
            fg.appendChild(mostvisited.view.genSiteNode(o[i]));
        }

        t.appendChild(fg);
    }
}

/*
TODO:Gen thumbnail of topSite.
     Actually, the function to
     generate the thumbnail of
     a specific site has already
     been finished.

//Gen Thumbnail of a page
mostvisited.view.genThumbnail = function(url){
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


mostvisited.view.showThumb = function(o){
    if(!o) return;
    
    var u = o.url;
    
    if(!localStorage[u]){
        mostvisited.view.genThumbnail(u);
    }else{
        mostvisited.view.genThumbCon(o);
    }
}

mostvisited.view.genThumbCon = function(o){
    
}
*/


mostvisited.init = function(){
    chrome.topSites.get(function(m){
        mostvisited.view.show(m);
    });
};