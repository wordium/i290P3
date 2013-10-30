/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function onLinkedInLoad() {
    IN.Event.on(IN, "auth", onLinkedInAuth);
}

function onLinkedInAuth()
{
    getProfiles("me");
    getConnections("me");


}
function getProfiles(users)
{
    if (!(users instanceof Array))
    {
        var temp = users;
        var users = [temp];
    }

    for (var i = 0, j = users.length; i < j; i++)
    {
        IN.API.Profile(users[i]).result(displayProfiles)
                .error(displayProfilesErrors);

    }
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
function displayProfiles(profiles) {
    member = profiles.values[0];
    $('#profiles').append("<p id=\"" + member.id + "\">Hello " + member.firstName + " " + member.lastName + "</p>");
    $('#profiles').append("<img src='" + member.pictureUrl + "' alt='" + member.firstName + " " + member.lastName + "'/>")
    console.log(member);
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
        var member = members[key];
        $('#connections').append("<p><img src='" + member.pictureUrl + "' alt='"
                + member.firstName + " " + member.lastName + "'/>" + 
                member.firstName + " " + member.lastName
                + " works in the " + member.industry + " industry</p>");
    }
}

function displayConnectionsErrors(error) { /* do nothing */
}