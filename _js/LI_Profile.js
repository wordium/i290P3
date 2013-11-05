/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function UserProfile(/*JSON Object*/) {
    if (arguments.length === 1)
    {
        var profile = arguments[0];
        this.name = "";
        this.id = 0;
        this.title = "";
        this.summary = "";
        this.location = "";
        this.position = [];
        this.education = [];
    }
    else {
        this.name = "";
        this.id = 0;
        this.title = "";
        this.summary = "";
        this.location = "";
        this.position = [];
        this.education = [];
    }
}

function Positions(/*JSON Object*/)
{
    if (arguments.length === 1)
    {
        var position = arguments[0];
        this.id = 0;
        this.company = ""; /*or institute*/
        this.title = ""; /*or degree*/
        this.subTitle = ""; /* or field of study*/
        this.startDate = new Date();
        this.endDate = new Date();
        this.summary = "";
        this.logo = "";
    }
    else
    {
        this.id = 0;
        this.company = ""; /*or institute*/
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