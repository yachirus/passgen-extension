chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({url: "passgen.html"});
});