var tabID = undefined;
chrome.browserAction.onClicked.addListener(function(tab) {
    if(tabID){
        chrome.tabs.update(tabID, {selected: true});
    }else{
        chrome.tabs.create({url: "passgen.html"},
                           function(tabobject){tabID = tabobject.id});
    }
});

chrome.tabs.onRemoved.addListener(function(removedTabID){
    if(removedTabID == tabID){
        tabID = undefined;
    }
});