var positions = [];
var educations = [];
var profile = [];

$(document).ready(function(){
	//getting the username

	var continueScrape = confirm("Do you want to scrape this user's profile data?");

	if (continueScrape == true) {    
		var url = window.location.pathname;
		var username = url.match("(/[a-z]*/)(.*)");
	    username = username[2];

		//populating the current and past positions
		$("#background-experience").find($("div[class='editable-item section-item']")).each(function(index) {
			populatePositionsObject($(this));
		});
		//console.log(positions);

		/*
		//populating the education experience
		$("#background-education").find($("div[class='editable-item section-item']")).each(function(index) {
			populateEducationObject($(this));		
		});
		//console.log(educations);
		*/

		//finding the ID in the linkedin profile page. It's located in a script tag, near newTrkInfo
		//credit to http://stackoverflow.com/questions/926580/find-text-string-using-jquery
	   $('*', 'script')
        .andSelf()
        .contents()
        .filter(function(){
            return this.nodeType === 3;
        })
        .filter(function(){
            // Only match when contains 'newTrkInfo' anywhere in the text
            return this.nodeValue.indexOf('newTrkInfo') != -1;
        })
        .each(function(){
            // Do something with this.nodeValue
            var nodeString = this.nodeValue;
            // Using Regex to get the profile ID
            var nodeStringRE = nodeString.match("newTrkInfo = '(.*),'");
            profileID = nodeStringRE[1];
        });

		profile.push({
			id: profileID, 
			name: $(".full-name").text(),
			profileUsername: username,
			picURL: $(".profile-picture").find($("img")).attr("src"),
			positionHistory: positions,
			educationHistory: educations 
		});
		//console.log(profile);
		//this sends the object positions to background.js
		chrome.runtime.sendMessage({objectProfileKey: JSON.stringify(profile)}, function(response) {
		});
	} else {
		return;
	}
});

function populatePositionsObject(object) {
	//this function is for populating data from past positions
	//splitting the dates into month and year

	//getting start date end date
	timeDate = object.find($("time")).toArray();
	var startDateInt = timeDate[0].attributes[0].value;
	startDateInt = startDateInt.split("-");
	if (timeDate[1].innerText === " – Present"){
			isCurrent = "1";
			var endDateInt = ["",""];
			endYear = "";	
		} else {
			var endDateInt = timeDate[1].attributes[0].value;
			endDateInt = endDateInt.split("-");
			};
	
	//pushing data to the posititions object
	positions.push({
	title : object.find($("a[name='title']")).text(),
	subTitle : "",
	companyName : $.trim(object.find($("strong")).text()),
	companyLocation : object.find($(".locality")).text(),
	companyIndustry : "unknown",
	startDateYear : startDateInt[0],
	startDateMonth : startDateInt[1],
	isPositionCurrent : isCurrent,
	endDateYear : endDateInt[0],
	endDateMonth : endDateInt[1],
	summary : $.trim(object.find($(".description")).text()),
	//logoUrl : object.find($(".experience-logo a span strong img")).attr("src")
	});
}

function populateEducationObject(object) {
	//this function is for populating data from Education History
	
	//getting start date end date
	timeDate = object.find($("time")).toArray();
	var startDateInt = timeDate[0].attributes[0].value;
	//startDateInt = startDateInt.split("-");
	var endDateInt = timeDate[1].attributes[0].value;
	//endDateInt = endDateInt.split("-");

	//pushing data to educations object
	educations.push({
		title : object.find($(".degree")).text(),
		subTitle : object.find($(".major")).text(),
		companyName : $.trim(object.find($("h4 a")).text()),
		companyLocation : object.find($(".locality")).text(),
		companyIndustry : "unknown",
		startDateYear : startDateInt,
		startDateMonth : "1",
		isPositionCurrent : isCurrent,
		endDateYear : endDateInt,
		endDateMonth : "12",
		summary : $.trim(object.find($(".description")).text()),
		//logoUrl : object.find($(".education-logo img")).attr("src")
	});

}