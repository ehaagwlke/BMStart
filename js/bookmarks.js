var bms = {};
	bms.view = {};
	bms.data = {};
	bms.data.bms = {};
	bms.view.config = {};

function log(msg){
	console.log(msg);
};

bms.view.createBMFolder = function(n){	

	if(!n){
	    log('bms.view.createBMFolder No bookmarkTreeNode found!');
	    return;
	}
	
	var fc = base.ui.ce(bms.view.config.folderTag,{id:n.id,'data-idx':n.index,'data-pidx':n.parentId, class:bms.view.config.folderTagClass}),
	    title = n.title ? n.title : chrome.i18n.getMessage("unnamedFolder"),
	    ft = base.ui.ce(bms.view.config.folderTitleTag,{textContent:title, id: n.id+'-fname'}),
	    bic = base.ui.ce(bms.view.config.bmItemContainerTag, {class:bms.view.config.bmItemContainerTagClass, id:n.id+'-list'});
		
	    fc.appendChild(ft);
	    fc.appendChild(bic);
	return fc;
};

bms.view.createBMItem = function(n){
	if(!n){
		log('bms.view.createBMItem No bookmarkTreeNode found.');
		return;
	}
	
	var title = n.title ? n.title : n.url,
		img = base.ui.ce('img',{src:'chrome://favicon/'+n.url,id: n.id+'-img'}),                     
		link = base.ui.ce('a',{href:n.url,id:n.id+'-link'}),
		bmi = base.ui.ce(bms.view.config.bmItemTag,{id:n.id,title:title,'data-idx':n.index,'data-pidx':n.parentId}),
		bt = base.ui.ce(bms.view.config.bmItemTitleTag,{id:n.id+'-text',textContent:title});
		
		link.appendChild(img);
		link.appendChild(bt);
		
		bmi.appendChild(link);
		
		return bmi;
}

bms.data.treeWalker = function(b){
    var length = b.length,
        i = 0;
        
    for(i; i<length; i++){
        var pid = b[i].parentId,
            id = b[i].id;
            
        if(b[i].children){
            bms.data.bms[id] = {};
            bms.data.bms[id]['title'] = b[i].title;
            bms.data.bms[id]['id'] = parseInt(b[i].id);
            bms.data.bms[id]['childCount'] = b[i].children.length;
            bms.data.bms[id]['index'] = b[i].index;
            bms.data.bms[id]['parentId'] = b[i].parentId;
            bms.data.bms[id]['children'] = {};
            bms.data.bms[id]['httpLinkCount'] = b[i].children.length;
            bms.data.treeWalker(b[i].children);
        }else{
            bms.data.bms[pid]['children'][id] = {};
            bms.data.bms[pid]['children'][id]['id'] = b[i].id;
            bms.data.bms[pid]['children'][id]['title'] = b[i].title;
            bms.data.bms[pid]['children'][id]['url'] = b[i].url;
            bms.data.bms[pid]['children'][id]['parentId'] = b[i].parentId;
            bms.data.bms[pid]['children'][id]['index'] = b[i].index;
            if(b[i].url.indexOf('javascript:') === 0){
                bms.data.bms[pid]['httpLinkCount']--;
            }
        }
    }
};

bms.view.show = function(o){
    var bmc = base.ui.ce(bms.view.config.bmContainerTag,{id:bms.view.config.bmContainerID}),
        i;
        
        $$(bms.view.config.bmParentID).appendChild(bmc);
        
    for(i in o){
        if(o.hasOwnProperty(i) && o[i]['id'] > 0 &&o[i]['childCount'] > 0 && o[i]['httpLinkCount'] > 0){
            var fc = bms.view.createBMFolder(o[i]);
            
            for(var j in o[i]['children']){
                var b = o[i]['children'][j];
                if(b['url'].indexOf("javascript:") !== 0){
                    fc.lastChild.appendChild(bms.view.createBMItem(b));
                }
            }
            
            bmc.appendChild(fc);
        }
    }
    if(bmc.childNodes.length === 0){
    	var d = bms.view.genDefStatNode();
    	$$(bms.view.config.bmParentID).appendChild(d);
    }else{
    	bmc.style.display="block";
    }
    
};

bms.view.genDefStatNode = function(){
	var t = chrome.i18n.getMessage('noBMData'),
    	d = base.ui.ce(bms.view.config.defStatTag,{id:bms.view.config.defStatID,textContent:t});
    return d;
};

bms.view.init = function(){
    chrome.bookmarks.getTree(function(b){
        bms.data.treeWalker(b);
        bms.view.show(bms.data.bms);
    });
};






/*
**************************
* Chrome bookmarks api   *
* Event listeners  start *
**************************
*/

chrome.bookmarks.onChanged.addListener(function(id,info){
    var url = info['url'],
        title = info['title'];
    
    if(!url){/*if it has no url, it must be a folder*/
        if($$(id)){/*if the folder is being shown*/
            $$(id+'-fname').innerHTML = title;/*we update the title*/
        }
    }else{/*if it has url, then it must be a bookmark item*/
        var _isJSPseudo = url.indexOf('javascript:') === 0 ? true : false;
        
        if(_isJSPseudo){/*if it's changed to a js bookmarklet*/
            if($$(id)){/*if it was shown, then we remove it*/
                $$(id).parentNode.removeChild($$(id));
                
                chrome.bookmarks.get(id, function(bmn){
                    var pid = bmn[0].parentId;
                    if($$(pid+"-list").childNodes.length === 0){
                        $$(pid).parentNode.removeChild($$(pid));
                    }
                });
            }
        }else{/*if it's changed to a normal url*/
            if($$(id)){/*if it's displayed, then we update the info*/
                $$(id).title = title;
                $$(id+'-img').src = "chrome://favicon/"+url;
                $$(id+'-link').href = url;
                $$(id+'-text').textContent = title;
            }else{
                chrome.bookmarks.get(id, function(bmn){
                    var pid = bmn[0].parentId;
                    
                    if($$(pid)){
                        $$(pid).appendChild(bms.view.createBMItem(bmn[0]));
                    }else{
                    
                    	if($$(bms.view.config.defStatID)){
                    		$$(bms.view.config.defStatID).parentNode.removeChild($$(bms.view.config.defStatID));
                    	}
                    
                        chrome.bookmarks.get(pid, function(pn){
                            $$(bms.view.config.bmContainerID).appendChild(bms.view.createBMFolder(pn[0]));
                            $$(pid).lastChild.appendChild(bms.view.createBMItem(bmn[0]));
                        });
                    }
                });
            }
        }
    }       
});


chrome.bookmarks.onRemoved.addListener(function(id,info){
    var bmi = $$(id);
    if(bmi){
        bmi.parentNode.removeChild(bmi);
        if($$(info['parentId']+"-list").childNodes.length === 0){
            $$(info['parentId']).parentNode.removeChild($$(info['parentId']));
        }
        
        if($$(bms.view.config.bmContainerID).childNodes.length === 0){
        	$$(bms.view.config.bmContainerID).appendChild(bms.view.genDefStatNode());
        }
        
    }else{
        //console.log("The bookmark item "+id+" is not shown.");
        //do nothing
    }
});


chrome.bookmarks.onCreated.addListener(function(id, bmTNs){
    if(bmTNs.url){
        if(bmTNs.url.indexOf('javascript:') === 0){
            return;
        }
        if(!$$(bmTNs.parentId)){
         
	        if($$(bms.view.config.defStatID)){
        		$$(bms.view.config.defStatID).parentNode.removeChild($$(bms.view.config.defStatID));
        	}
         
            chrome.bookmarks.get(bmTNs.parentId, function(bmn){
                $$(bms.view.config.bmContainerID).appendChild(bms.view.createBMFolder(bmn[0]));
                $$(bmTNs.parentId).lastChild.appendChild(bms.view.createBMItem(bmTNs));
            });	
        }else{
            $$(bmTNs.parentId).lastChild.appendChild(bms.view.createBMItem(bmTNs));
        }
    }else{
        //do nothing
    }
});

chrome.bookmarks.onMoved.addListener(function(id, info){
    var bmi = $$(id);
    
    //if the moved item is not shown,
    //it should be a folder, so do nothing
    if(!bmi){
        return;
    }
    
    //check if the moved item
    //is a folder or not
    //default value is false
    var _isFolder =  bmi.tagName.toUpperCase() === bms.view.config.bmItemContainerTag ? true : false;
    
    //If the moved item is NOT a folder
    //and its parentId changed, then
    //we remove it from the page and
    //before append it to its current
    //parent container, check if the
    //target container was shown or not
    //if NOT, then get it, and show it.
    if(!_isFolder && info['parentId'] !== info['oldParentId']){
        bmi.parentNode.removeChild(bmi);
        if(!$$(info['parentId'])){
            chrome.bookmarks.get(info['parentId'], function(bmn){
                $$(bms.view.config.bmContainerID).appendChild(bms.view.createBMFolder(bmn[0]));
                $$(info['parentId']).lastChild.appendChild(bmi);
            });
        }else{
            $$(info['parentId']).lastChild.appendChild(bmi);
        }
    }
    
    //if the oldParent folder of the
    //moved bookmark has only one childNode
    //then after the move, it should be hidden
    if($$(info['oldParentId']+"-list").childNodes.length === 0){
        $$(info['oldParentId']).parentNode.removeChild($$(info['oldParentId']));
    }
});


/*
**************************
* Chrome bookmarks api   *
* Event listeners  end   *
**************************
*/

bms.init = function(){
    //as a part of bookmarks,
    //topSites should be initialed
    //HERE.
    mostvisited.init();
    bms.view.init();
};
