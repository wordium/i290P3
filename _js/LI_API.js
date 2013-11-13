/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var userDataTimeline = [];
var workHistory = [];

var PROFILE_FIELDS = ["id", "first-name", 'last-name', 'formatted-name',
    'headline', 'location', 'industry', 'summary',
    'num-connections', 'specialties', 'picture-url',
    'public-profile-url', 'three-past-positions', 'email-address',
    'publications', 'skills', 'educations:(degree)', 'positions'];



$(document).ready(function()
{
    init();
});
var LI_Athenticated = false;
var currentUser;
var COUNT_LIMIT = 0;

function init() {
    $.getScript("http://platform.linkedin.com/in.js?async=true", function success() {
        IN.init({
            onLoad: "onLinkedInLoad"
        });
    });
    eventPeopleSearch();
}
function onLinkedInLoad() {
    IN.Event.on(IN, "auth", onLinkedInAuth);
}

function onLinkedInAuth()
{
    LI_Athenticated = true;
    currentUser = IN.User.getMemberId();
    drawCurrentUserProfile();
//    var profiles = getProfiles("me");
    console.log(IN.User.getMemberId());
    var connections = getConnections("me");

    getCurrentUserHistory();

    var other = "cppham";
    getOtherUserHistory(other);
}

function getCurrentUserHistory()
{
    IN.API.Profile("me")
            .fields(PROFILE_FIELDS)
            .result(function(profiles) {
                var profile = profiles.values[0];
                var myUrl = profile.publicProfileUrl;
                //getting the linkedin username from the public profile url
                username = myUrl.match("(.com/[a-z]*/)(.*)");
                username = username[2];
                getCurrentProfileFromSQL(username); //goto getProfileFromSQL function to use the object

            });
}

function getOtherUserHistory(otherUser)
{
    getCurrentProfileFromSQL(otherUser); //goto getProfileFromSQL function to use the object
    //var myUrl = profile.publicProfileUrl;

    //username = myUrl.match("(.com/[a-z]*/)(.*)");
    //username = username[2];

}

function getUserProfileFromDB(profile)
{
    var myUrl = profile.publicProfileUrl;
    //getting the linkedin username from the public profile url
    username = myUrl.match("(.com/[a-z]*/)(.*)");
    username = username[2];
    getCurrentProfileFromSQL(username); //goto getProfileFromSQL function to use the object
}
function drawCurrentUserProfile()
{
    IN.API.Profile("me")
            .fields(PROFILE_FIELDS)
            .result(function(profiles) {

                var profile = new UserProfile(profiles.values[0]);
                $('#my-profile').empty().append(profile.formatHTML());
                drawTimeline(profile, '#my-timeline');
            });
}
function getProfiles(users)
{
    var loadedProfiles = [];
    if (!(users instanceof Array))
    {
        var temp = users;
        var users = [temp];
    }

    for (var i = 0, j = users.length; i < j; i++)
    {
//        var loadProfile = $.Deferred();
        var profile;
        IN.API.Profile(users[i])
                .fields(PROFILE_FIELDS)
                .result(function(profiles) {
                    profile = profiles.values[0];
                    loadedProfiles[i] = profile;
                    displayProfiles(profile);
                    var member = new UserProfile(profile);
//                    console.log(member);
                })
                .error(displayProfilesErrors);
    }

}

function getConnections(users)
{
    if (COUNT_LIMIT > 0)
        IN.API.Connections(users)
                .fields(PROFILE_FIELDS)
                .params({"count": COUNT_LIMIT})
                .result(drawConnections)
                .error(function() {
                    console.log("deferred rejected");
                });
    else
        IN.API.Connections(users)
                .fields(PROFILE_FIELDS)
                .result(drawConnections)
                .error(function() {
                    console.log("deferred rejected");
                });
}

function getDeferredConnections(user)
{
//    console.log('getting connections for ' + user);
    return IN.API.Connections(user)
            .fields(PROFILE_FIELDS)
            .params({"count": 20})
            .result(function(connections) {
                return connections;
            })
            .error(function() {
                console.log("deferred rejected");
            });
}
function displayProfiles(member) {
//    console.log(profiles);
}
function displayProfilesErrors(error) {
    //profilesDiv = document.getElementById("profiles");
    //profilesDiv.innerHTML = "<p>Oops!</p>";
    console.log(error);
}

function findPeopleByIndustry(industry)
{

}
function drawConnections(connections)
{
//    console.log(connections);
    var members = connections.values; // The list of members you are connected to
    var profiles = [];
    for (var i = 0, j = members.length; i < j; i++)
    {
        var member = members[i];
        var userProfile = new UserProfile(member);
        profiles[i] = userProfile;
    }
    drawIndustryBarChart(profiles); //drawing.js
    drawMap(profiles);
}

/**
 * 
 * @param {UserProfile} userProfile
 * @returns {undefined}
 */

function displayConnections(connections) {
//  var connectionsDiv = document.getElementById("connections");

    var members = connections.values; // The list of members you are connected to
    for (var key in members) {
        try {
            var member = members[key];
            $('#connections').append("<p>" +
                    ((member.pictureUrl) ? "<img src='" + member.pictureUrl + "' alt='" + member.firstName + " " + member.lastName + "'/>" : "")
                    + member.firstName + " " + member.lastName
                    + ((member.industry) ? " works in the " + member.industry + " industry" : "")
                    + "</p>");
        } catch (err)
        {
            console.log(err);
            continue;
        }
    }
}

function displayConnectionsErrors(error) { /* do nothing */
}

function eventPeopleSearch()
{
    $('#keyword-search-button').click(function() {
        console.log('people search ' + $('#keywords').val());
        PeopleSearch($('#keywords').val());
    });
}
function PeopleSearch(keywords) {
// Call the PeopleSearch API with the viewer's keywords
// Ask for 4 fields to be returned: first name, last name, distance, and Profile URL
// Limit results to 10 and sort by distance
// On success, call displayPeopleSearch(); On failure, do nothing.
//    var keywords = document.getElementById('keywords').innerText;
    console.log('People search for ' + keywords);
    IN.API.PeopleSearch()
            .fields("id", "firstName", "lastName", "pictureUrl", "distance", "siteStandardProfileRequest")
            .params({"keywords": keywords, "count": 20, "sort": "distance"})
            .result(displayPeopleSearch)
            .error(function error(e) { /* do nothing */
            }
            );
}

function displayPeopleSearch(peopleSearch) {
//    var div = document.getElementById("peopleSearchResults");
    var div = "";
    div = "<ul>";
    // Loop through the people returned
    var members = peopleSearch.people.values;
    console.log(members);
    for (var member in members) {

// Look through result to make name and url.
        var nameText = members[member].firstName + " " + members[member].lastName;
        var url = (members[member].siteStandardProfileRequest) ? members[member].siteStandardProfileRequest.url : "";
        // Turn the number into English
        var distance = members[member].distance;
        var distanceText = '';
        switch (distance) {
            case 0:  // The viewer
                distanceText = "you!";
                break;
            case 1: // Within three degrees
            case 2: // Falling through
            case 3: // Keep falling!
                distanceText = "a connection " + distance + " degrees away.";
                break;
            case 100: // Share a group, but nothing else
                distanceText = "a fellow group member.";
                break;
            case -1: // Out of netowrk
            default: // Hope we never get this!
                distanceText = "far, far, away.";
        }

        div += "<li><a href=\"" + url + "\">" + nameText +
                "</a> is " + distanceText + "</li>";
    }

    div += "</ul>";
    $('#people-search-results').empty().append(div);
}

//making a call to get information from database
function getCurrentProfileFromSQL(object) {
    $.ajax({
        type: "post",
        url: "phpScript.php",
        data: "action=getprofile" + "&username=" + object
    })
            .done(function(data) {
                var parsedData = JSON.parse(data);
                var userHistory = creatingProfileObject(parsedData);
                console.log(userHistory);
            })
            .fail(function(data) {
                console.log("fail");
            });
}

//making a call to get information from database
function getOtherProfileFromSQL(username) {
    $.ajax({
        type: "post",
        url: "phpScript.php",
        data: "action=getprofile" + "&username=" + username
    })
            .done(function(data) {
                var parsedData = JSON.parse(data);
                console.log(parsedData);
                var profile = creatingProfileObject(parsedData);
                drawTimeline(profile, '#remote-timeline');
            })
            .fail(function(data) {
                console.log("fail");
            });
}

//creating the profile object
function creatingProfileObject(data) {
    //var workHistory = [];
    //var profile = [];
    //workHistory1.push({hello: "Mooo"});
    var profile = new UserProfile();
    if (data)
    {
        var profile = new UserProfile();
        profile.id = data[0].profileID;
        profile.name = data[0].name;
        profile.username = data[0].username;
        profile.pictureUrl = data[0].picURL;



        for (var i = 0; i < data.length; i++)
        {
            //console.log(data[i].positionCompanyName);
            //pushing data to the positions object

            var position = new Position();
            position.id = Math.random()*1000000;
            position.title = data[i.positionTitle];
            position.company = data[i].positionCompanyLocation;
            position.industry = data[i].positionCompanyIndustry;
            position.startYear = parseInt(data[i].positionStartDateYear);
            position.startMonth = parseInt(data[i].positionStartDateMonth);
            position.startDate = new Date(position.startYear, position.startMonth);
            position.isCurrent =  data[i].positionEndDateIsCurrent===1;
            if (position.isCurrent)
            {
                position.endDate = new Date();
                position.endYear = (new Date()).getFullYear();
                position.endMonth = (new Date()).getMonth;
            }
            else {

                position.endYear = parseInt(data[i].positionEndDateYear);
                position.endMonth = parseInt(data[i].positionEndDateMonth);
                position.endDate = new Date(position.endYear, position.endMonth);
            }
            position.summary = data[i].positionSummary;
            profile.positions.push(position);
            /*
             workHistory.push({
             isPositionOrEducation: data[i].isPositionOrEducation,
             title: data[i].positionTitle,
             subTitle: data[i].positionSubTitle,
             company: {
             name: data[i].positionCompanyName,
             location: data[i].positionCompanyLocation,
             industry: data[i].positionCompanyIndustry,
             },
             startDate: {
             year: data[i].positionStartDateYear,
             month: data[i].positionStartDateMonth,
             },
             endDate: {
             isCurrent: data[i].positionEndDateIsCurrent,
             year: data[i].positionEndDateYear,
             month: data[i].positionEndDateMonth,
             },
             summary: data[i].positionSummary,
             });*/
        }
    }
    //console.log(userDataTimeline);
    console.log(profile);
    return profile;

}




