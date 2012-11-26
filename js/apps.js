var app = {};
    app.view = {};
    app.data = {};
    
    app.view.config = {};

app.view.genAppNode = function(a){
    if(!a) return;
    
    var an = base.ui.ce(app.view.config.appNodeTag,{title:a.name}),
        iconURL = app.data.icon(a),
        iNode = base.ui.ce('IMG',{src:iconURL}),
        tNode = base.ui.ce(app.view.config.appNodeTitleTag,{textContent:a.name});
    
        an.appendChild(iNode);
        an.appendChild(tNode);
    
    
        an.onclick =  function(){
            if(a.appLaunchUrl){
                chrome.tabs.getCurrent(function(tab){
                    chrome.tabs.update(tab.id,{url:a.appLaunchUrl});
                });
            }else{
                chrome.management.launchApp(this.id);
            }
        };

    return an;
};

app.view.genAppsCon = function(){
    return base.ui.ce(app.view.config.appConTag,{id:app.view.config.appConTagId, class:app.view.config.appConTagClass});
}

app.view.show = function(a){
    if(!a) return;
    
    var l = a.length,
        i = 0,
        b = [];
    
    for(i; i<l; i++){
        if(app.view.config.showAllExt){
            b.push(a[i]);
        }else{
            if(a[i].isApp && a[i].enabled){
                b.push(a[i]);
            }
        }
    }
     
    var bl = b.length,
        j = 0,
        con = app.view.genAppsCon(),
        pn = $$(app.view.config.appConParentNodeId);
    
    for(j; j<bl; j++){
        var node = app.view.genAppNode(b[j]);
        con.appendChild(node);
    }
    
    var wsname = chrome.i18n.getMessage('webStore'),
        webStoreObj = {
            "name":wsname,
            "icons":[{"size":128,"url":"/img/wsi.png"}],
            "appLaunchUrl":"https://chrome.google.com/webstore/"
        };
    
    con.appendChild(app.view.genAppNode(webStoreObj));
    pn.appendChild(con);
    con.style.display = "block";
}

app.data.icon = function(a){
    if(!a) return;
    if(!a.icons){
    	return undefined;
    }
    
    var l = a.icons.length,
        i = 0;
    
    if(0 === l){
        return;
    }
    
    for(i; i<l; i++){
        if(app.view.config.appIconSize === a['icons'][i]['size']){
            return a['icons'][i]['url'];
        }
    }
};


app.view.init = function(apps){
    app.view.show(apps);
};

app.init = function(){
    chrome.management.getAll(function(apps){
        app.view.init(apps);
    });
};
