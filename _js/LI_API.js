/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
var COUNT_LIMIT = 0;

function init() {
    eventPeopleSearch();
}
function onLinkedInLoad() {
    IN.Event.on(IN, "auth", onLinkedInAuth);
}

function onLinkedInAuth()
{
    LI_Athenticated = true;
//    var profiles = getProfiles("me");

    var connections = getConnections("me");

    //currentUser = IN.User.getMemberUrl();
    IN.API.Profile("me")
    .fields("publicProfileUrl", "firstName")
    .result(displayProfiles);

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
//    member = profiles.values[0];
    /*
     $('#profiles').append("<p id=\"" + member.id + "\">Hello " + member.firstName
     + " " + member.lastName + "</p>");
     $('#profiles').append("<img src='" + member.pictureUrl + "' alt='"
     + member.firstName + " " + member.lastName + "'/>");
     */
//    console.log(member);
    return member;
}
function displayProfilesErrors(error) {
//    console.log(profiles);
    member = profiles.values[0];
    var myUrl = member.publicProfileUrl;
    //console.log(myUrl);
    //getting the linkedin username from the public profile url
    username = myUrl.match("([^/]+$)");
    username = username[1];
    console.log(username);
    console.log(window.location.pathname);
    getProfileFromSQL(username);
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
function getProfileFromSQL (object) {
    $.ajax({
        type:"post",
        url:"http://people.ischool.berkeley.edu/~jenton/iolab_p3/phpScript.php",
        data:"action=getprofile"+"&profileID="+object
    })
        .done(function(data){
            var parsedData = JSON.parse(data);
            //console.log(parsedData);
            //console.log(parsedData["name"]);
            creatingProfileObject(parsedData);

        })
        .fail(function(data){
            console.log("fail");
        });
}

//creating the profile object
function creatingProfileObject(data) {

    for (var i = 0; i < data.length; i++) {
        //console.log(data[i].positionCompanyName);
        //pushing data to the positions object
        workHistory.push({
            isPositionOrEducation : data[i].isPositionOrEducation,
            title : data[i].positionTitle,
            subTitle : data[i].positionSubTitle,
            company : {
                    name : data[i].positionCompanyName,
                    location : data[i].positionCompanyLocation,
                    industry : data[i].positionCompanyIndustry,
                },
            startDate : {
                    year : data[i].positionStartDateYear,
                    month : data[i].positionStartDateMonth,
                },
            endDate : {
                    isCurrent : data[i].positionEndDateIsCurrent,
                    year : data[i].positionEndDateYear,
                    month : data[i].positionEndDateMonth,
                },
            summary : data[i].positionSummary,
        });
    };

    profile.push({
        id: data[0].profileID, 
        name: data[0].name,
        picURL: data[0].picURL,
        history: workHistory
    });

    console.log(profile);
}