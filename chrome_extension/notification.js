chrome.extension.onMessage.addListener(function (msg, _, sendResponse) {
    chrome.tabs.executeScript(null, {file: "jquery.2.0.3.js"}, function(){
    	console.log(msg.data);
    	for (i in msg.data) {

    		for (j in msg.data[i].educationHistory) {
    		//console.log(msg.data[i].positionHistory);
    		console.log(msg.data[i].educationHistory[j].company.name);
    		$("#div1").append("<p>" + msg.data[i].educationHistory[j].company.name + "</p>");
    		$("#div1").append("<p>" + msg.data[i].educationHistory[j].title + "</p>");
    		//$("#div1").append("<p>" + msg.data[i].positionHistory) + "</p>");
			}
    	}
    });
	/*var para=document.createElement("p");
	var node=document.createTextNode(JSON.stringify(msg));
	para.appendChild(node);

	var element=document.getElementById("div1");
	element.appendChild(para);*/

	//$("p").text(JSON.stringify(msg));	

});