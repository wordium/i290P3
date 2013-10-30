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
    IN.API.Profile("me","url=http://www.linkedin.com/in/sandray")
    .fields("id", "firstName", "lastName", "industry", "distance", "headline", "currentShare", "summary", "specialties", "positions", "pictureUrl").result(displayProfiles);
    /*IN.API.Profile("me")
    .fields("id", "firstName", "lastName", "industry", "distance", "headline", "currentShare", "summary", "specialties", "positions", "pictureUrl").result(displayProfiles);*/
    /*getProfiles("me"); 
    getConnections("me");*/


}

function displayProfiles(profiles) {
    var members = profiles.values;
    
    for (var member in members) {
        //initialize variables
        firstName = members[member].firstName;
        lastName = members[member].lastName;
        picture = members[member].pictureUrl;
        headline = members[member].headline;
        industry = members[member].industry;
        currentShare = members[member].currentShare;
        summary = members[member].summary;
        specialties = members[member].specialties;
        distance = members[member].distance;

        $('#profiles').append("<p>Welcome " + firstName + " " + lastName + "</p>");
        $('#profiles').append("<img src='" + picture + "' alt='" + firstName + " " + lastName + "'/>")
        $('#profiles').append("<p>Headline: " + headline + "</p>");
        $('#profiles').append("<p>Industry: " + industry + "</p>");
        $('#profiles').append("<p>Current Share: " + currentShare + "</p>");
        $('#profiles').append("<p>Summary: " + summary + "</p>");
        $('#profiles').append("<p>Specialties: " + specialties + "</p>");
        $('#profiles').append("<p>Distance: " + distance + "</p>");
        
        /* Display positions */
        var positionList = members[member].positions.values;
        console.log(positionList);
        for (var position in positionList) {
            //initialize variables
            companyName = positionList[position].company.name;
            positionTitle = positionList[position].title;
            positionStartDate = positionList[position].startDate.month + "/" + positionList[position].startDate.year; 

            $('#profiles').append("<p>Positions: " + companyName + " - " + positionTitle + " Start Date: " + positionStartDate);
            if (positionList[position].isCurrent === false) {
                endDate = positionList[position].endDate.month + "/" + positionList[position].endDate.year;
                $('#profiles').append(" End Date: " + endDate);
            } else if (positionList[position].isCurrent === true) {
                endDate = "Current";
                $('#profiles').append(" End Date: " + endDate);
            }
            $('#profiles').append("</p>");
             console.log(positionList[position].startDate.month);
             console.log(positionList[position].title);    
        }
        
        $('#profiles').append("<hr>");
        /*console.log(members[member]);*/
       
    }
}

/*
function displayProfilesErrors(error) {
    profilesDiv = document.getElementById("profiles");
    profilesDiv.innerHTML = "<p>Oops!</p>";
    console.log(error);
}
*/

/*
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
*/

/*
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
        $('#connections').append("<p>Headline: " + member.headline + "</p>");
    }
}

function displayConnectionsErrors(error) {
}*/