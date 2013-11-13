//var workHistory = [];
//var profile = [];

$(document).ready(function() {
    var id = "12503649";
    //getProfileFromSQL(id)
});

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'Novmeber', 'December'];
function UserProfile(/*JSON Object*/) {
    if (arguments.length === 1)
    {

        var profile = arguments[0];
        this.name = profile.formattedName;
        this.email = profile.emailAddress;
        this.id = profile.id;
        this.title = profile.headline;
        this.summary = profile.summary;
        this.location = (profile.location) ? profile.location.name : "";
        this.countryCode = (profile.location) ?
                (profile.location.country.code + "").toUpperCase() : "";
        this.positions = [];
        if (profile.positions)
        {
            if (profile.positions.values)
            {
                var pos = profile.positions.values;
                for (var i = 0, j = pos.length; i < j; i++)
                {
                    var position = new Position(pos[i]);
                    this.positions.push(position);
                    if (position.isCurrent)
                        this.currentCompany = position.company;
                }

            }
        }
        this.educations = [];
        var edu = (profile.educations) ? profile.educations.values : "";/*
         for (var i = 0, j = edu.length; i < j; i++)
         this.educations[i] = new Position(edu[i]);
         */
        this.industry = profile.industry;
        this.pictureUrl = (profile.pictureUrl) ? profile.pictureUrl : "";
        if (profile.publicProfileUrl)
        {
            this.profileUrl = profile.publicProfileUrl;
            var user = this.profileUrl.match("(.com/[a-z]*/)(.*)");
            this.username = user[2];
//            console.log(this.username);
        }
        else
        {
            this.profileUrl = "";
            this.username = "";
        }
       
    }
    else {
        this.name = "";
        this.email = "";
        this.id = "";
        this.title = "";
        this.summary = "";
        this.location = "";
        this.positions = [];
        this.educations = [];
        this.industry = "";
        this.pictureUrl = "";
        this.profileUrl = "";
        this.currentCompany = "";
        this.username = "";
    }

//    this.formatHTML = formatHTML;
}


UserProfile.prototype.formatHTML = function()
{
    var str = "<div id='profile-" + this.id
            + "' class='user-profile'>"
            + "<a href='" + this.profileUrl + "' target='_blank'>"
            + "<h2>" + this.name + "</h2>"
            + "<img src='" + this.pictureUrl + "' alt='" + this.name + "'/>"
            + "</a>"
            + "<h3>" + this.title + "</h3>";
    if (this.positions && this.positions.length > 0)
        str += "<p>"
                + ((this.positions[0].company) ? this.positions[0].company : "") + "</p>";
    str += ((this.summary) ? "<strong>Summary:</strong><p>" + this.summary + "</p>" : "")
 
            + "</div>";

    return str;
}

function Position(/*JSON Object*/)
{
    this.id = 0;
    this.company = ""; /*or institute*/
    this.industry = "";
    this.title = ""; /*or degree*/
    this.subTitle = ""; /* or field of study*/
    this.summary = "";
    this.logo = "";
    if (arguments.length === 1)
    {
        var position = arguments[0];
        this.id = position.id;
        this.company = (position.company.name) ? position.company.name :
                ((position.degree) ? position.degree : ""); /*or institute*/
        this.industry = position.company.industry;
        this.title = position.title; /*or degree*/
        this.subTitle = ""; /* or field of study*/
        this.startYear = (position.startDate) ? position.startDate.year : 0;
        this.startMonth = (position.startDate) ? position.startDate.month : 1;

        this.startDate = (position.startDate) ? new Date(position.startDate.year,
                ((position.startDate.month) ? position.startDate.month : 1), 1) : "";
        this.endDate = (position.isCurrent)
                ? new Date() : new Date(position.endDate.year,
                ((position.endDate.month) ? position.endDate.month : 1), 1);

        this.endMonth = (position.endDate) ? position.endDate.month : 1;
        this.endYear = (position.endDate) ? position.endDate.year : (new Date()).getFullYear();
        this.isCurrent = position.isCurrent;
        this.summary = position.summary;
        this.logo = "";
    }
    else
    {

        this.startYear = 0;
        this.startMonth = 0;
        this.endYear = 0;
        this.endMonth = 0;
        this.startDate = new Date();
        this.endDate = new Date();

    }
}

Position.prototype.formatHTML = function()
{

    var pos = new Position();
    pos = this;
    console.log(pos);
    var str = "<div id='position-" + this.id
            + "' class='position-preview'>"
            + "<p> <strong>" + this.title + "</strong></p>"
            + "<p>" + this.subTitle + "</p>"
            + "<p>" + this.company + "</p>"
            + "<p>" + this.industry + "</p>"
            + "<p>" + ((this.startMonth) ? months[this.startMonth - 1] : "") + " " + this.startYear + " - "
            + ((this.isCurrent) ? "Present" : ((this.endMonth) ? months[this.endMonth - 1] : "") + " " + this.endYear) + "</p>"
            + ((this.summary) ? "<p>" + this.summary + "</p>" : "");

    return str;

}

function formatDate(dateString)
{
    //return date object from string
    return new Date();
}


