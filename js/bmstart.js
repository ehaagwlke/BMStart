/*==========ext=========
	whole view control
	of this extension
======================*/

var extBMS = {};
    extBMS.view = {};

    extBMS.view.funcs = new Array();
    extBMS.view.funcs['bms'] = bms;
    extBMS.view.funcs['app'] = app;

extBMS.view.shownSecId = {
    set:function(n){
        if(!n || typeof n !== "string"){
            return;
        }else{
            localStorage[extBMS.view.config.currViewLocalStorageId] = n;
        }
    },
    get:function(){
        var cid = extBMS.view.config.currViewLocalStorageId;
        if(localStorage[cid]){
            return localStorage[cid];
        }else{
            return 0;
        }
    }
}

extBMS.view.setTitles = function(){
    $$(extBMS.view.config.appSecID).textContent = chrome.i18n.getMessage('APPSecTitle');
    $$(extBMS.view.config.bmSecID).textContent = chrome.i18n.getMessage('BMSecTitle');
    //$$(rclsd.view.config.rclsdButtonId).textContent = chrome.i18n.getMessage('rclsdButtonTitle');
};

extBMS.view.switcher = function(){    
    var switcherItems = $$(extBMS.view.config.switcherContainerID).childNodes;

    for(var i = 0; i < switcherItems.length; i++){
        switcherItems[i].onclick = function(){

            //click on currently shown item
            //will trigger nothing
            if(this.getAttribute('class') === 'at'){
                return;
            }

            //click on a not-currently-shown item
            //other items those have class 'at'
            //will get their class removed
            for(var j = 0; j<switcherItems.length; j++){
                if(j != i && switcherItems[j].nodeType === 1 && switcherItems[j].getAttribute("class") === "at"){ 
                    switcherItems[j].removeAttribute('class');
                    var c = switcherItems[j].getAttribute('data-cid');
                    $$(c).style.display="none";
                }
            }
            
            //the clicked item will get a new class 'at'
            this.setAttribute('class','at');
            
            
            var cid = this.getAttribute('data-cid'),
                cn = this.getAttribute('data-sn');

                if(extBMS.view.funcs[cn]){
                    extBMS.view.funcs[cn].init();
                    delete extBMS.view.funcs[cn];
                }
                co = $$(cid);
                
                co.style.display="block";
                
                extBMS.view.shownSecId.set(this.id);
        };
    }
};

extBMS.view.init = function(){
    extBMS.view.setTitles();
  
    var cvid = extBMS.view.shownSecId.get() || extBMS.view.config.bmSecID,
        wid = $$(cvid).getAttribute("data-cid"),
        cn = $$(cvid).getAttribute("data-sn");
    
    if(extBMS.view.funcs[cn]){
        extBMS.view.funcs[cn].init();
        delete extBMS.view.funcs[cn];
    }
    
    $$(wid).style.display="block";
    $$(cvid).setAttribute('class','at');
    extBMS.view.shownSecId.set(cvid);
    
    extBMS.view.switcher();
};

extBMS.init = function(){
    extBMS.view.init();
}