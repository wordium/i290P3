chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file: "jquery.2.0.3.js"}, function(){
        //chrome.tabs.executeScript(null, {file: "linkedin-scrape.js"}, function(dataObject){
        chrome.tabs.executeScript(null, {file: "linkedin-scrape.js"}, function(){


        });
    });
});

            chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    //this code would send a response back to linkedin-scrape.js    
    //sendResponse({farewell: "goodbye"});
    
            //Created new tab
            chrome.tabs.create({
            url: "notification.html"
            }, function (tab) {
            //just to make sure the tab is activated..
            chrome.tabs.onUpdated.addListener(function (tabId) {
                if (tabId == tab.id) {
                    //Send Mesage
                    chrome.tabs.sendMessage(tabId, {
                        //"data": "whatever_data"
                        "data": JSON.parse(request.objectProfileKey) //to be sent to notification.js
                    });
                }
            });
            });
  });