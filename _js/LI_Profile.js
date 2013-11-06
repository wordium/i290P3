/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function UserProfile(/*JSON Object*/) {
    if (arguments.length === 1)
    {
        var profile = arguments[0];
        this.name = profile.formattedName;
        this.email = profile.emailAddress;
        this.id = profile.id;
        this.title = profile.headline;
        this.summary = profile.summary;
        this.location = profile.location.name;

        var pos = profile.positions.values;
        this.positions = [];
        for (var i = 0, j = pos.length; i < j; i++)
            this.positions[i] = new Position(pos[i]);

        this.educations = [];
        var edu = profile.educations.values;/*
        for (var i = 0, j = edu.length; i < j; i++)
            this.educations[i] = new Position(edu[i]);
*/
        this.industry = profile.industry;
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
    }
}

function Position(/*JSON Object*/)
{
    if (arguments.length === 1)
    {
        var position = arguments[0];

        this.id = position.id;
        this.company = (position.company.name) ? position.company.name : position.degree; /*or institute*/
        this.industry = position.company.industry;
        this.companyId = position.company.id;
        this.title = position.title; /*or degree*/
        this.subTitle = ""; /* or field of study*/
        this.startDate = new Date(position.startDate.year,
                position.startDate.month, 1);
        this.endDate = (position.isCurrent)
                ? new Date() : new Date(position.endDate.year,
                position.endDate.month, 1);
        this.summary = position.summary;
        this.logo = "";
    }
    else
    {
        this.id = 0;
        this.company = ""; /*or institute*/
        this.industry = "";
         this.companyId = 0;
        this.title = ""; /*or degree*/
        this.subTitle = ""; /* or field of study*/
        this.startDate = new Date();
        this.endDate = new Date();
        this.summary = "";
        this.logo = "";
    }
}

function formatDate(dateString)
{
    //return date object from string
    return new Date();
}