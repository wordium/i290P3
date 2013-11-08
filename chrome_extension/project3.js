chrome.extension.onMessage.addListener(function (msg, _, sendResponse) {
    console.log(msg.data);
    
    	//console.log(msg.data);
    	for (i in msg.data) {
            picURL = msg.data.picURL;            
            $("#div1").append("<p><img src='" + msg.data[i].picURL + "'></p>");
            $("#div1").append("<p>" + msg.data[i].name + "</p>");
            $("#div1").append("<p>" + msg.data[i].id + "</p>");
    		for (j in msg.data[i].educationHistory) {
    		//console.log(msg.data[i].positionHistory);
    		  console.log(msg.data[i].educationHistory[j].company.name);
    		  $("#div1").append("<p>" + msg.data[i].educationHistory[j].company.name + "</p>");
    		  $("#div1").append("<p>" + msg.data[i].educationHistory[j].title + "</p>");
    		  //$("#div1").append("<p>" + msg.data[i].positionHistory) + "</p>");
			}
    	}
        
	/*var para=document.createElement("p");
	var node=document.createTextNode(JSON.stringify(msg));
	para.appendChild(node);

	var element=document.getElementById("div1");
	element.appendChild(para);*/

	//$("p").text(JSON.stringify(msg));	

});