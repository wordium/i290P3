/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 
 *
 *  */


$(document).ready(function()
{
    init();
});


var Company;
var Application_Name;
var API_Key;
var Secret_Key;
var OAuth_User_Token;
var OAuth_User_Secret;
var PROPERTIES_FILENAME = 'apikeys.properties';

function init() {
    readProperties(PROPERTIES_FILENAME)
    main();
}
function loadProperties(filename)
{
    java;
    var p = new java.util.Properties();
    var fis = new java.io.FileInputSteam(filename);
    p.load(fis);
    fis.close();

    Company = p.getProperty("Company");
    Application_Name = p.getProperty("Application_Name");
    API_Key = p.getProperty("API_KEY");
    Secret_Key = p.getProperty("Secret_Key");
    OAuth_User_Token = p.getProperty("OAuth_User_Token");
    OAuth_User_Secret = p.getProperty("OAuth_User_Secret");
    console.log(API_Key);
}
function readProperties(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function()
    {
        if (rawFile.readyState === 4)
        {
            if (rawFile.status === 200 || rawFile.status == 0)
            {

                var allText = rawFile.responseText;
                var lines = allText.split('\n');
//                console.log(lines);
                for (var i = 0, j = lines.length; i < j; i++)
                {
                    var line = "";
                    line = lines[i];
//                    console.log(line);
                    if (line.substr(0, 1) !== '#')
                    {

                        var prop = line.split('=');
//                        console.log(prop);
                        switch (prop[0])
                        {
                            case 'Company':
                                Company = prop[1]
                                break;
                            case 'Application_Name':
                                Application_Name = prop[1]
                                break;
                            case 'API_Key':
                                API_Key = prop[1]
                                break;
                            case 'Secret_Key':
                                Secret_Key = prop[1]
                                break;
                            case 'OAuth_User_Token':
                                OAuth_User_Token = prop[1]
                                break;
                            case 'OAuth_User_Secret':
                                OAuth_User_Secret = prop[1]
                                break;
                        }

                    }

                }
            }
        }
    }
    rawFile.send(null);
}
function main()
{

}

function onLinkedInAuth() {
    // this must be the same domain as the application, where we write the cookie
    console.log("Authenticated");
    console.log(document.cookie);
    $.post('http://people.ischool.berkeley.edu/~jannah/i290P3/');
    // extract data from cookie stored in json
    var consumer_key = API_Key;
    var cookie_name = "linkedin_oauth_"+ consumer_key;
    console.log(consumer_key+"\t"+cookie_name);
    var credentials_json = getCookie(cookie_name); // where PHP stories cookies
//    $credentials = json_decode($credentials_json);

    console.log(credentials_json);
}

function getCookie(c_name)
{
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
    {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1)
    {
        c_value = null;
    }
    else
    {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1)
        {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}