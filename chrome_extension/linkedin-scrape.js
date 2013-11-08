var positions = [];
var educations = [];
var profile = [];

$(document).ready(function(){
	//populating the current and past positions
	$("#profile-experience").find($(".position")).each(function(index) {
		if ($(this).find($(".dtstamp")).text()) {
			populatePositionsObjectCurrent($(this));	
		} else {	
			populatePositionsObject($(this));
		};
	});
	
	//populating the education experience
	$("#profile-education").find($(".position")).each(function(index) {
		populateEducationObject($(this));		
	});
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

	//console.log(thing);
	profile.push({
		id: profileID, 
		name: $(".given-name").text() + " " + $(".family-name").text(),
		picURL: $("#profile-picture").find($("img")).attr("src"),
		positionHistory: positions,
		educationHistory: educations 
	});
	//console.log(positions);
	//console.log(educations);
	//console.log(profile);
	alert("Profile added");
		
	//this sends the object positions to background.js
	chrome.runtime.sendMessage({objectProfileKey: JSON.stringify(profile)}, function(response) {
		//console.log(response.farewell);
	});
});
		
function populatePositionsObjectCurrent(object) {
	//this function is for populating data from the current position
	var startDateInt = object.find($(".dtstart")).attr("title").split("-");

	//getting the industry
	var orgStats = (object.find($(".orgstats")).text().split(";"));
	for (i in orgStats){
		orgStats[i] = $.trim(orgStats[i]);
	};

	//pushing data to the positions object
	positions.push({
	title : object.find($(".title")).text(),
	subTitle : "",
	company : {
			name : $.trim(object.find($(".org.summary")).text()),
			location : object.find($(".location")).text(),
			industry : orgStats[orgStats.length-1], //industry always seems to be the last element in the orgstats array
		},
	startDate : {
			year : startDateInt[0],
			month : startDateInt[1],
		},
	endDate : {
			isCurrent : "1",
			year : "",
			month : "",
		},
	summary : $.trim(object.find($(".description")).text()),

	});

}

function populatePositionsObject(object) {
	//this function is for populating data from past positions
	
	//splitting the dates into month and year
	var startDateInt = object.find($(".dtstart")).attr("title").split("-");
	var endDateInt = object.find($(".dtend")).attr("title").split("-");

	//getting the industry
	var orgStats = (object.find($(".orgstats")).text().split(";"));
	for (i in orgStats){
		orgStats[i] = $.trim(orgStats[i]);
	};

	//pushing data to the positions object
	positions.push({
	title : object.find($(".title")).text(),
	subTitle : "",
	company : {
			name : $.trim(object.find($(".org.summary")).text()),
			location : object.find($(".location")).text(),
			industry : orgStats[orgStats.length-1], //industry always seems to be the last element in the orgstats array
		},
	startDate : {
			year : startDateInt[0],
			month : startDateInt[1],
		},
	endDate : {
			isCurrent : "0",
			year : endDateInt[0],
			month : endDateInt[1],
		},
	summary : $.trim(object.find($(".description")).text()),
	

	});
}

function populateEducationObject(object) {
	//this function is for populating data from Education History
	
	//splitting the dates into month and year. If start date or end date don't exist, replace with ""
	if (object.find($(".dtstart")).attr("title")) {
		var startDateInt = object.find($(".dtstart")).attr("title").split("-");	
	} else {
		var startDateInt = ["",""];
	}
	
	if (object.find($(".dtend")).attr("title")) {
		var endDateInt = object.find($(".dtend")).attr("title").split("-");	
	} else {
		var endDateInt = ["",""];
	}
	
	//End Date might be problematic. I'm not sure what the html looks like if a user's most current education
	//has 'Current' as it's end date.

	//pushing data to educations object
	educations.push({
	title : object.find($(".degree")).text(), //Degree
	subTitle : $.trim(object.find($(".major")).text()), //Major
	company : {
			name : $.trim(object.find($(".org.summary")).text()), //College Name
			industry : "",
		},
	startDate : {
			year : startDateInt[0],
			month : startDateInt[1],
		},
	endDate : {
			isCurrent : "0",
			year : endDateInt[0],
			month : endDateInt[1],
		},
	location : object.find($(".location")).text(),
	summary : $.trim(object.find($(".description")).text()),

	});
}