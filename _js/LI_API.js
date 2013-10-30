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
var ACCESS_TOKEN;

function init() {
    readProperties(PROPERTIES_FILENAME)
//    main();
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
    var credentials_json = loadCookie();
    if (validateSignature(credentials_json))
    {
        ACCESS_TOKEN = credentials_json.access_token;
        makeAPICall();
    }
}

function makeAPICall()
{
    // configuration settings
//$consumer_key = 'YOUR_API_KEY';
//$consumer_secret = 'YOUR_SECRET_KEY';
//    var access_token_url = 'https://api.linkedin.com/uas/oauth/accessToken';

    var requestURL = 'https://api.linkedin.com/v1/people/~?oauth2_access_token=' + ACCESS_TOKEN;
    /*   
     $.ajax({ //my ajax request
     url: "_URL_I_AM_MAKING_REQUEST_TO_",
     type: "GET",
     cache: false,
     dataType: "json",
     crossDomain: true,
     data: { _mydata_
     success : function(response){}
     });*/


    $.ajax({
        type: 'GET',
        url: requestURL,
        processData: true,
        data: {},
        dataType: "json",
        success: function(data) {
            processData(data);
        }
    });

    $.get(requestURL).done(function(data) {
        console.log(data);
    });
    /*
     
     var accessor = {consumerSecret: SECRET_KEY
     , tokenSecret: ACCESS_TOKEN; }
     var message = {action: POST
     , method: form.method
     , parameters: []
     };
     */
// init the client
    /*
     var oauth = new OAuth(API_KEY, Secret_Key);
     oauth.
     // swap 2.0 token for 1.0a token and secret
     var oauth.fetch(access_token_url, array('xoauth_oauth2_access_token' => $access_token), OAUTH_HTTP_METHOD_POST);
     // parse the query string received in the response
     parse_str($oauth->getLastResponse(), $response);
     
     // Debug information
     print "OAuth 1.O Access Token = " . $response['oauth_token'] . "\n";
     print "OAuth 1.O Access Token Secret = " . $response['oauth_token_secret'] . "\n";
     
     */
}
function processData(data) {
    console.log('processing data');
    console.log(data);
}
function validateSignature(credentials_json)
{
    var creds = {};
    creds = credentials_json;

//    $consumer_secret = 'YOUR_SECRET_KEY';
    console.log('validating');
// validate signature
    for (var key in credentials_json)
    {
        console.log(key + ':' + credentials_json[key]);
    }
//    console.log(credentials_json.signature_version);
    console.log(credentials_json.signature_order.constructor);
    if (credentials_json.signature_version === "1") {
        if (credentials_json.signature_order && credentials_json.signature_order instanceof Array) {
            var base_string = '';
            // build base string from values ordered by signature_order
            for (var i in credentials_json.signature_order)
            {
                var key = credentials_json.signature_order[i];
                console.log(key + '\t' + credentials_json[key]);
                base_string += credentials_json[key];
            }
            console.log(base_string);
            // hex encode an HMAC-SHA1 string
            var hash = CryptoJS.HmacSHA1(base_string, Secret_Key);
            console.log(hash);
            var signature = CryptoJS.enc.Base64.stringify(hash);

            console.log(signature);
//            var signature = base64_encode(hash_hmac('sha1', base_string, Secret_Key, true));
            // check if our signature matches the cookie's
            if (signature == credentials_json.signature) {
                console.log("signature validation succeeded");
                return true;
            } else {
                console.log("signature validation failed");

            }
        } else {
            console.log("signature order missing");
        }
    } else {
        console.log("unknown cookie version");
    }
    return false;
}
function loadCookie() {

    console.log('loading cookie');
    var consumer_key = API_Key;
    var cookie_name = "linkedin_oauth_" + consumer_key;
    console.log(consumer_key + "\t" + cookie_name);
    var credentials_json = getCookie(cookie_name); // where PHP stories cookies
//    $credentials = json_decode($credentials_json);

    console.log(credentials_json);


    return JSON.parse(credentials_json);
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


function callLIAPI(parameters_input, api_input) {
    var xhr = new easyXDM.Rpc({
        remote: "http://api.linkedin.com/"
    }, {
        remote: {
            request: {} // request is exposed by /cors/
        }
    });
    xhr.request({
        url: "v1/people/cors~?",
        method: "POST",
        data: {oauth2_access_token: ACCESS_TOKEN}
    }, function(response) {
        alert(response.status);
//        alert(response.data);
        console.log(response.data);
    });
    /*
     var api_details = {
     parameters: parameters_input,
     api: api_input,
     type: 'GET'
     }
     return $.ajax({
     url: '_js/LI_proxy.php',
     type: 'POST',
     dataType: 'json',
     data: api_details,
     success: function(data, textStatus, xhr) {
     console.log("LI Call Successful " + api_input);
     },
     error: function(xhr, textStatus, errorThrown) {
     console.log("LI Call Failed " + api_input);
     }
     });*/
}
function onLinkedInAuth() {
//   $.post('_js/LI_proxy.php');
// location.href = "_js/LI_proxy.php";
    /*
     var credentials_json = loadCookie();
     $.ajax({
     url: '_js/LI_proxy.php',
     type: 'POST',
     //        dataType: 'json',
     success: function(data, textStatus, xhr) {
     console.log("validated");
     console.log(data);
     },
     error: function(xhr, textStatus, errorThrown) {
     console.log("error");
     console.log(textStatus);
     console.log(errorThrown);
     }
     });*/
//    $.post('index.html');
}
var sampleSignature = {"signature_version": "1", "signature_method": "HMAC-SHA1", "signature_order": ["access_token", "member_id"], "access_token": "j66-0VBBeH_6LDbfUKWOhWttU-n5oyvpr55D", "signature": "eBPZJqu+E2zFNJyfp6hus+thueA=", "member_id": "aUOotmfvmP"};
