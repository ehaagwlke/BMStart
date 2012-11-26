var rclsd = {};
	rclsd.data = {};
	rclsd.view = {};
	rclsd.view.config = {
		"rclsdConTag":"UL",
		"rclsdConId":"rclsdList",
		"rclsdConClass":"rcls",
		"rclsdItemTag":"LI",
		"rclsdItemShowNum":15
	}
	


chrome.tabs.onCreated.addListener(function(tab){
	var t = {};
		t[tab.id] = {};
		t[tab.id]['id'] = tab.id;
		t[tab.id]['url'] = tab.url;
		t[tab.id]['title'] = tab.title ? tab.title : tab.url,
		aot = localStorage['allOpenedTabs'] ? localStorage['allOpenedTabs'] : 0;
	
	if(!aot){
		localStorage['allOpenedTabs'] = JSON.stringify(t);
	}else{
		var tt =  JSON.parse(localStorage['allOpenedTabs']);
		tt[tab.id] = t[tab.id];
		localStorage['allOpenedTabs'] = JSON.stringify(tt);
	}
});

chrome.tabs.onRemoved.addListener(function(id, info){
	var tid = id,
		tt = JSON.parse(localStorage['allOpenedTabs']),
		t = {},
		rct = localStorage['recentlyClosedTabs'] ? localStorage['recentlyClosedTabs'] : 0;
	if(rct){
		t = JSON.parse(rct);
	}
	
	t[tid] = {};
	t[tid] = tt.tid;
	localStorage['recentlyClosedTabs'] = JSON.stringify(t);
	
	delete tt.tid;
	localStorage['allOpenedTabs'] = JSON.stringify(tt);
	
});
