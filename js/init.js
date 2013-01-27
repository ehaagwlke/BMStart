//mostvisited config
mostvisited.view.config = {
    "containerId":"topSitesLinks",
    "titleContainerId": "topSitesTitle",
    "titleStr": chrome.i18n.getMessage("mostVisited"),
    "siteNodeTag": "li",
    "blackListKey": "mvBlackList"
}

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

//recently closed tabs config
rclsd.view.config = {
    "rclsdButtonId":"rct",
    "rclsdConTag":"UL",
    "rclsdConId":"rclsdList",
    "rclsdConClass":"rcls",
    "rclsdItemTag":"LI",
    "rclsdItemShowNum":30,
    "rclsdItemStoreNum":50,
    "rclsdTabsStoreID":"rclsdTabs"
}
//init the extension
extBMS.init();