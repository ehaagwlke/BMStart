//mostvisited config
mostvisited.containerId = 'topSitesLinks';
mostvisited.titleContainerId = 'topSitesTitle';
mostvisited.titleStr = chrome.i18n.getMessage('mostVisited');
mostvisited.siteNodeTag = 'li';

//bookmarks config
bms.view.config = {
    "bmParentID":"BM",
    "bmContainerTag":"DIV",
	"bmContainerID":"BMList",
	"folderTag":"DIV",
	"folderTagClass":"BMListCon",
	"folderTitleTag":"h3",
	"bmItemContainerTag":"UL",
	"bmItemContainerTagClass":"BMListItem",
	"bmItemTag":"LI",
	"bmItemTitleTag":"SPAN",
	"defStatID":"defaultText",
	"defStatTag":"P"
};

//apps config
app.view.config = {
    "appConParentNodeId":"apps",
    "appConTag":"UL",
    "appConTagClass":"apps-list",
    "appConTagId":"appsList",
    "appNodeTag":"LI",
    "appNodeTitleTag":"P",
    "appIconSize": 128
};

//extBMS config
extBMS.view.config = {
    "switcherContainerID":"switcherCon",
    "appSecID":"app-sec",
    "appContainerID":app.view.config.appConParentNodeId,
    "bmSecID":"bm-sec",
    "bmContainerID":bms.view.config.bmParentID,
    "rctSecID":"rct",
    "currViewLocalStorageId":"currViewId"
};

//init the extension
extBMS.init();
