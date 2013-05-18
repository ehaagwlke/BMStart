/*
    Date: 18/May/2013
    Version: 1.0
    Description:
        Scroll the page using `j` and `k`.
    Todo:
        switch views using `h` and `l` will 
        be implemented in the coming days.
*/
document.body.addEventListener('keydown', function(e){
    var cid,
        aid = extBMS.view.config.appSecID,
        bid = extBMS.view.config.bmSecID,
        isVisible,
        isInitd;

    isVisible = function(kid){
        return cid === kid;
    }

    isInitd = function(nid){
        return $$(nid).childNodes.length > 0 ? true : false;
    }

    switch(e.keyCode){
        case 74: 
            document.body.scrollTop += 20;
            break;

        case 75: 
            document.body.scrollTop -= 20;
            break;
    }
}, false);