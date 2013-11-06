/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function()
{
    init();
});
function init() {
    eventPeopleSearch();
}
function onLinkedInLoad() {
    IN.Event.on(IN, "auth", onLinkedInAuth);
}

function onLinkedInAuth()
{
    var profiles = getProfiles("me");
    console.log(profiles);
//    getConnections("me");


}
function getProfiles(users)
{
    var loadedProfiles = [];
    var fields = ["id", "first-name", 'last-name', 'formatted-name',
        'headline', 'location', 'industry', 'summary',
        'num-connections', 'specialties', 'picture-url',
        'public-profile-url', 'three-past-positions', 'email-address',
        'publications', 'skills', 'educations:(degree)', 'positions'];
    if (!(users instanceof Array))
    {
        var temp = users;
        var users = [temp];
    }

    for (var i = 0, j = users.length; i < j; i++)
    {

//        var loadProfile = $.Deferred();
        var profile;

        console.log('loading profile');
        IN.API.Profile(users[i])
                .fields(fields)
                .result(function(profiles) {
                     profile = profiles.values[0];
                    loadedProfiles[i] = profile;
                    displayProfiles(profile);
                    var member = new UserProfile(profile);
                    console.log(member);
                })
                .error(displayProfilesErrors);
    }

//    console.log(loadedProfiles);
//    return loadedProfiles;
}
/**
 * TODO
 * @param {type} users
 * @returns {Array}
 */
function getDefferedProfile(users)
{

    var loadedProfiles = [];
    var fields = ["id", "first-name", 'last-name', 'formatted-name',
        'headline', 'location', 'industry', 'summary',
        'num-connections', 'specialties', 'picture-url',
        'public-profile-url', 'three-past-positions', 'email-address',
        'publications', 'skills', 'educations:(id,degree,school-name)', 'positions'];
    if (!(users instanceof Array))
    {
        var temp = users;
        var users = [temp];
    }

    for (var i = 0, j = users.length; i < j; i++)
    {

        var myObject = {
            myMethod: function(myString) {
                console.log('myString was passed from', myString);
            }
        };
// Create deferred
        var deferred = $.Deferred();

// deferred.done(doneCallbacks [, doneCallbacks ])
        deferred.done(function(method, string) {
            console.log(this); // myObject

            // myObject.myMethod(myString);
            this[method](string);
        });

        deferred.resolve.call(myObject, 'myMethod', 'the context');

        var loadProfile = $.Deferred();
        var profile;

        console.log('loading profile');
        IN.API.Profile(users[i])
                .fields(fields)
                .result(function(profiles) {
                    profile = profiles.values[0];
                    loadedProfiles[i] = profile;
                    var member = new UserProfile(profile);
                    ;
//                    displayProfiles(member);


                })
                .error(displayProfilesErrors);
    }

    console.log(loadedProfiles);
    return loadedProfiles;
    // Create an object



// We could also do this:
// deferred.resolveWith(myObject, ['myMethod', 'resolveWith']);
// but it's somewhat annoying to pass an array of arguments.

// => myString was passed from resolveWith
}

function getConnections(users)
{
    if (!(users instanceof Array))
    {
        var temp = users;
        var users = [temp];
    }

    for (var i = 0, j = users.length; i < j; i++)
    {
        IN.API.Connections(users[i])
                .fields("firstName", "lastName", "industry", "pictureUrl")
                .result(displayConnections);
    }
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
    console.log(member);
    return member;
}
function displayProfilesErrors(error) {
    profilesDiv = document.getElementById("profiles");
    profilesDiv.innerHTML = "<p>Oops!</p>";
    console.log(error);
}

function findPeopleByIndustry(industry)
{

}

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