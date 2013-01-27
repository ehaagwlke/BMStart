var rclsd = {};
    rclsd.data = {};
    rclsd.view = {};

rclsd.data.allOpendTabs = {};

rclsd.data.blackList = {
    'chrome:' : 'chrome:', 
    'about:' : 'about:'
};

rclsd.data.tabs = {
    set: function(tab){
        var key = rclsd.view.config.rclsdTabsStoreID,
            ls = localStorage[key],
            timeStamp = new Date().getTime(),
            data = ls ? JSON.parse(ls) : {};

        data[timeStamp] = tab;
        localStorage[key] = JSON.stringify(data);
    },
    get: function(){
        var key = rclsd.view.config.rclsdTabsStoreID,
            ls = localStorage[key];
        return JSON.parse(ls);
    }
}

rclsd.data.store = function(tab){
	var max = rclsd.view.config.rclsdItemStoreNum,
		key = rclsd.view.config.rclsdTabsStoreID,
		ls = localStorage[key],
		l = ls ? JSON.parse(ls).length : 0;

	if(!l || l+1 < max){
		rclsd.data.tabs.set(tab);
	}else{
		var data = JSON.parse(ls);
	}
}

chrome.tabs.getAllInWindow(null, function(tabs){
    for(var tab in tabs){
        rclsd.data.allOpendTabs[tabs[tab].id] = tabs[tab];
    }
});

//console.log(rclsd.data.allOpendTabs);

chrome.tabs.onUpdated.addListener(function(tid, info, tab){
    if(info['status'] === 'complete'){
        if(tab !== undefined){
            rclsd.data.allOpendTabs[tab.id] = tab;
        }
    }
});

chrome.tabs.onRemoved.addListener(function(tid){
	var tab = rclsd.data.allOpendTabs[tid];

	
});