var bms = {};
    bms.view = {};
    bms.data = {};
    bms.data.bms = {};
    bms.view.config = {};

function log(msg){
    console.log(msg);
};

function editFolderTitle(id){
    var einput,
        ospan,
        oftitle,
        bmnId,
        nftitle;

    ospan = $$(id);
    bmnId = ospan.getAttribute('data-fid');
    oftitle = ospan.textContent;

    einput = base.ui.ce('input',{
        'value': oftitle
    });

    ospan.parentNode.insertBefore(einput, ospan.nextSibling);
    ospan.style.display = 'none';
    einput.focus();
    einput.select();

    function updateBMFTitle(){
        if(einput.value.length > 0){
            nftitle = einput.value;
        }else{
            nftitle = oftitle;
        }
        repaint();
        chrome.bookmarks.update(bmnId, {
            title: nftitle
        }, function(bmt){
            //do nothing now;
        });
    }

    function repaint(){
        //if the input we created still in the dom tree
        //we should remove it.
        if(einput.parentNode){
            einput.parentNode.removeChild(einput);
        }
        ospan.removeAttribute('style');
    }

    einput.addEventListener('keydown', function(e){
        if(e && (e.keyCode === 13 || e.keyCode === 27)){
            updateBMFTitle();
        }
    }, false);

    einput.addEventListener('blur', function(){
        setTimeout(function(){
            updateBMFTitle();
        }, 50);
    }, false);
}

bms.view.createBMFolder = function(n){    

    if(!n){
        log('bms.view.createBMFolder No bookmarkTreeNode found!');
        return;
    }
    
    var fc,
        title,
        titleContainer,
        linkCountSpan,
        ft,
        bic;

    fc = base.ui.ce(bms.view.config.folderTag,{
        id:n.id,
        'data-idx':n.index,
        'data-pidx':n.parentId, 
        class:bms.view.config.folderTagClass
    });
    title = n.title ? n.title : chrome.i18n.getMessage("unnamedFolder");
    titleContainer = base.ui.ce('span', {
        textContent: title,
        id: n.id+'-fname',
        'data-fid': n.id,
        'class': 'fname'
    });
    
    //we can not modify the folder name
    //of root bookmark folders.
    if(n.id > 3){
        titleContainer.addEventListener('dblclick', function(){
            editFolderTitle(n.id+'-fname');
        }, false);
    }


    linkCountSpan = base.ui.ce('span');
    ft = base.ui.ce(bms.view.config.folderTitleTag);
    bic = base.ui.ce(bms.view.config.bmItemContainerTag, {
        class:bms.view.config.bmItemContainerTagClass, 
        id:n.id+'-list'
    });
    
    linkCountSpan.textContent= '('+ (n.httpLinkCount ? n.httpLinkCount : 1) +')';

    ft.appendChild(titleContainer);
    ft.appendChild(linkCountSpan);
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
        link = base.ui.ce('a',{href:n.url, title:title, id:n.id+'-link'}),
        bmi = base.ui.ce(bms.view.config.bmItemTag,{id:n.id,'data-idx':n.index,'data-pidx':n.parentId}),
        bt = base.ui.ce(bms.view.config.bmItemTitleTag,{id:n.id+'-text',textContent:title}),
        removeSign = base.ui.ce('a', {'class':'remove-sign', 'textContent':'x'});

    removeSign.onclick = function(){
        bms.data.removeBMI(n.id);
    }

    link.appendChild(img);
    link.appendChild(bt);

    bmi.appendChild(link);
    bmi.appendChild(removeSign);

    return bmi;
};

bms.data.removeBMI = function(id){
    var msg = chrome.i18n.getMessage('deleteBMIConfirm'),
        conf = confirm(msg);

    if(conf){
        var pn = $$(id).parentNode,
            pnc = pn.getAttribute('class');
        if(pnc === bms.view.config.bmItemContainerTagClass){
            var l = pn.childNodes.length - 1;
            if(l > 0){
                pn.previousSibling.lastChild.textContent = '('+l+')';
            }else{
                pn.parentNode.parentNode.removeChild(pn.parentNode);
            }
        }

        chrome.bookmarks.remove(id);
    }
};

bms.data.treeWalker = function(b){
    var length = b.length,
        i = 0;
        
    for(i; i<length; i++){
        var pid = b[i].parentId,
            id = b[i].id;
        
        if(b[i].children){
            var item = {};
                item['title'] = b[i].title;
                item['id'] = parseInt(b[i].id);
                item['childCount'] = b[i].children.length;
                item['index'] = b[i].index;
                item['parentId'] = pid;
                item['children'] = {};
                item['httpLinkCount'] = 0;

            bms.data.bms[id] = item;
            bms.data.treeWalker(b[i].children);
        }else{
            var item = {};
                item['id'] = b[i].id;
                item['title'] = b[i].title;
                item['url'] = b[i].url;
                item['parentId'] = b[i].pid;
                item['index'] = b[i].index;

            if(b[i].url.indexOf('javascript:') === 0){
                bms.data.bms[pid]['httpLinkCount'] -= 1;
            }else{
                bms.data.bms[pid]['httpLinkCount'] += 1;
            }

            bms.data.bms[pid]['children'][id]  = item;
        }
    }
};

bms.view.show = function(o){
    var bmc = base.ui.ce(bms.view.config.bmContainerTag,{id:bms.view.config.bmContainerID}),
        i;
        
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
        $$(bms.view.config.bmParentID).appendChild(bmc);
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
                        /* if it's the last item and removed, we hide the folder*/
                        $$(pid).parentNode.removeChild($$(pid));
                    }else{
                        /*If the folder was not hidden, then update the link count number*/
                        var l = $$(pid).lastChild.childNodes.length;                        
                        $$(pid).firstChild.lastChild.textContent = '('+l+')';
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
                        $$(pid).lastChild.appendChild(bms.view.createBMItem(bmn[0]));

                        /* update link count number */
                        var l = $$(pid).lastChild.childNodes.length;
                        $$(pid).firstChild.lastChild.textContent = '('+l+')';
                    }else{
                    
                        if($$(bms.view.config.defStatID)){
                            $$(bms.view.config.defStatID).parentNode.removeChild($$(bms.view.config.defStatID));
                        }
                    
                        chrome.bookmarks.get(pid, function(pn){
                            $$(bms.view.config.bmContainerID).appendChild(bms.view.createBMFolder(pn[0]));
                            $$(pid).lastChild.appendChild(bms.view.createBMItem(bmn[0]));

                            /* update link count number */
                            var l = $$(pid).lastChild.childNodes.length;
                            $$(pid).firstChild.lastChild.textContent = '(' + l + ')';
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
        }else{
            var l = $$(info['parentId']).lastChild.childNodes.length;
            $$(info['parentId']).firstChild.lastChild.textContent = '('+l+')';
        }
        
        if($$(bms.view.config.bmContainerID).childNodes.length === 0){
            $$(bms.view.config.bmContainerID).appendChild(bms.view.genDefStatNode());
        }
        
    }
});


chrome.bookmarks.onCreated.addListener(function(id, bmTNs){
    var pid = bmTNs.parentId;
    if(bmTNs.url){/*if a bookmark item was created*/
        if(bmTNs.url.indexOf('javascript:') === 0){/*if it is a js bookmarklet, return*/
            return;
        }

        if(!$$(pid)){/*if the folder was not shown on page*/
            if($$(bms.view.config.defStatID)){/* if the page is in default state, remove the placeholder*/
                $$(bms.view.config.defStatID).parentNode.removeChild($$(bms.view.config.defStatID));
            }
         
            chrome.bookmarks.get(pid, function(bmn){
                var fg = base.ui.cdf(),
                    folder = bms.view.createBMFolder(bmn[0]);
                    item = bms.view.createBMItem(bmTNs);

                folder.lastChild.appendChild(item);
                fg.appendChild(folder);

                $$(bms.view.config.bmContainerID).appendChild(fg);
            });    
        }else{
            $$(pid).lastChild.appendChild(bms.view.createBMItem(bmTNs));
            var l = $$(pid).lastChild.childNodes.length;
            $$(pid).firstChild.lastChild.textContent = '('+l+')';
        }
    }else{/*if a bookmark folder was created*/
        //do nothing
    }
});

chrome.bookmarks.onMoved.addListener(function(id, info){
    
    //if the moved item is not shown,
    //it should be a folder, so do nothing
    if(!$$(id)){
        return;
    }
    
    //check if the moved item
    //is a folder or not
    //default value is false
    var _isFolder =  $$(id).tagName.toUpperCase() === bms.view.config.bmContainerTag ? true : false;
    
    //If the moved item is NOT a folder
    //and its parentId changed, then
    //we remove it from the page and
    //before append it to its current
    //parent container, check if the
    //target container was shown or not
    //if NOT, then get it, and show it.
    if(!_isFolder && info['parentId'] !== info['oldParentId']){
        var bmi = $$(id);
        bmi.parentNode.removeChild(bmi);
        if(!$$(info['parentId'])){
            chrome.bookmarks.get(info['parentId'], function(bmn){
                $$(bms.view.config.bmContainerID).appendChild(bms.view.createBMFolder(bmn[0]));
                $$(info['parentId']).lastChild.appendChild(bmi);
            });
        }else{
            $$(info['parentId']).lastChild.appendChild(bmi);
        }

        var l = $$(info['parentId']).lastChild.childNodes.length;
        $$(info['parentId']).firstChild.lastChild.textContent = '('+l+')';
    }

    //if the oldParent folder of the
    //moved bookmark has only one childNode
    //then after the move, it should be hidden
    if($$(info['oldParentId']+"-list").childNodes.length === 0){
        $$(info['oldParentId']).parentNode.removeChild($$(info['oldParentId']));
    }else{
        var l = $$(info['oldParentId']).lastChild.childNodes.length;
        $$(info['oldParentId']).firstChild.lastChild.textContent = '('+l+')';
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