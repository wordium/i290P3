<?php 

require_once('PhpConsole.php'); // This enables PHP logging to browser console https://code.google.com/p/php-console/
PhpConsole::start();
// test
 
// print "starting php";


// You MUST modify app_tokens.php to use your own Oauth tokens 
//require '_OATH/app_tokens.php'; 


require '_OATH/tmhOAuth.php'; 

// extract data from cookie stored in json
$consumer_secret ='DSOKtsCVMZGwg5gA';
$consumer_key = '9ezmu5cjbccd';
$cookie_name = "linkedin_oauth_${consumer_key}";
$credentials_json = $_COOKIE[$cookie_name]; // where PHP stories cookies
$credentials = json_decode($credentials_json);

print $credentials;

// validate signature
if ($credentials->signature_version == 1) {
    if ($credentials->signature_order && is_array($credentials->signature_order)) {
        $base_string = '';
        // build base string from values ordered by signature_order
        foreach ($credentials->signature_order as $key) {
            if (isset($credentials->$key)) {
                $base_string .= $credentials->$key;
            } else {
                print "missing signature parameter: $key";
            }
        }
        // hex encode an HMAC-SHA1 string
        $signature =  base64_encode(hash_hmac('sha1', $base_string, $consumer_secret, true));
        // check if our signature matches the cookie's
        if ($signature == $credentials->signature) {
            print "signature validation succeeded";
        } else {
            print "signature validation failed";    
        }
    } else {
        print "signature order missing";
    }
} else {
    print "unknown cookie version";
}

$access_token_url = 'https://api.linkedin.com/uas/oauth/accessToken';

require('OAuth.php');
// init the client
//$oauth = new OAuth($consumer_key, $consumer_secret);
//$oauth = new OAuthConsumer($consumer_key, $consumer_secret);
$access_token = $credentials->access_token;))
print $access_token;
$oauth = new tmhOAuth(array( 
 'consumer_key' => $consumer_key, 
 'consumer_secret' => $consumer_secret, 
 'user_token' => $access_token, 
 'user_secret' => $user_secret 

print $oauth;
//$oauth_request = OAuthRequest->from_consumer_and_token( $oauth, $access_token 'POST', $access_token_url);

print $oauth_request ;


/*
// swap 2.0 token for 1.0a token and secret
$oauth->fetch($access_token_url, array('xoauth_oauth2_access_token' => $access_token), OAUTH_HTTP_METHOD_POST);
// parse the query string received in the response
parse_str($oauth->getLastResponse(), $response);

// Debug information
print "OAuth 1.O Access Token = " . $response['oauth_token'] . "\n";
print "OAuth 1.O Access Token Secret = " . $response['oauth_token_secret'] . "\n";
*/
 
// Create an OAuth connection 
/*
 
$connection = new tmhOAuth(array( 
 'consumer_key' => $consumer_key, 
 'consumer_secret' => $consumer_secret, 
 'user_token' => $user_token, 
 'user_secret' => $user_secret 
)); 
 
 //capture post parameters

$parameters = $_POST['parameters'];
$api = $_POST['api'];
$call_type = $_POST['type'];
$param_array = array();



foreach($parameters as $key=> $value){	
	$param_array[$key]= $value;
}


if($call_type =='GET'){
	$http_code = $connection->request('GET',$connection->url($api), $param_array); 
}elseif ($call_type == 'POST'){
	
	$http_code = $connection->request('POST', $connection->url('1.1/statuses/update'), $param_array);
}

$oauth->setToken($response['oauth_token'],$response['oauth_token_secret']);
*/
/*
// Get the timeline with the Twitter API 

 
// Request was successful 
if ($http_code == 200) { 
 
// Handle errors from API request 
} else { 
 if ($http_code == 429) { 
// print 'Error: Twitter API rate limit reached'; 
 } else {
// print 'Error: Twitter was not able to process that request';
 } 

}*/ 
?>