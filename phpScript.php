<?php
 // connects to my ischool mysql database. username: jenton, password: qwerty, database: jenton
  $con = mysqli_connect("localhost", "jenton", "qwerty", "jenton");
 
 // Failure check
if (mysqli_connect_errno($con))
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

//grabbing data from the POST
//$bizID = $_POST["bizID"];
//$profileArray = json_decode($_POST["profile"]);

//echo var_dump($profileArray);
//echo var_dump($profileArray);

/*foreach ($profileArray['0'] as $value) {

  }*/

//store the reviewIDs from the page. Looks like a string "1,2,3,4,5", so need to split it into a PHP array.
$idArray = $_POST["reviewIDs"];
$idArray = explode(",", $idArray);

if ($_POST["action"] == "educationinfo") {
  $profileArray = json_decode($_POST["profile"],true);

  $name = mysqli_real_escape_string($con, $profileArray['0']['name']);
  $profileID = $profileArray['0']['profileID'];
  $picURL = $profileArray['0']['picURL'];
  $title =  mysqli_real_escape_string($con, $profileArray['0']['title']);
  $subTitle = mysqli_real_escape_string($con, $profileArray['0']['subTitle']);
  $school = mysqli_real_escape_string($con, $profileArray['0']['companyName']);
  $location = mysqli_real_escape_string($con, $profileArray['0']['location']);
  $industry = mysqli_real_escape_string($con, $profileArray['0']['companyIndustry']);
  $startDateYear = $profileArray['0']['startDateYear'];
  $startDateMonth = $profileArray['0']['startDateMonth'];
  $isCurrent = $profileArray['0']['endDateIsCurrent'];
  $endDateYear = $profileArray['0']['endDateYear'];
  $endDateMonth = $profileArray['0']['endDateMonth'];
  $summary = mysqli_real_escape_string($con, $profileArray['0']['summary']);

  //debugging
  //$query = "INSERT INTO linkedin (profileID, name, picURL, isPositionOrEducation, positionTitle, positionSubTitle, positionCompanyName, positionCompanyLocation, positionCompanyIndustry, positionStartDateYear, positionStartDateMonth, positionEndDateIsCurrent, positionEndDateYear, positionEndDateMonth, positionSummary) VALUES ('$profileID', '$name', '$picURL', 1, '$title', '$subTitle', '$school', '$location', '$industry', '$startDateYear', '$startDateMonth', '$isCurrent', '$endDateYear','$endDateMonth', '$summary')";
  //echo $query;
  
  $query=mysqli_query($con,"INSERT INTO linkedin (profileID, name, picURL, isPositionOrEducation, positionTitle, positionSubTitle, positionCompanyName, positionCompanyLocation, positionCompanyIndustry, positionStartDateYear, positionStartDateMonth, positionEndDateIsCurrent, positionEndDateYear, positionEndDateMonth, positionSummary) VALUES ('$profileID', '$name', '$picURL', 1, '$title', '$subTitle', '$school', '$location', '$industry', '$startDateYear', '$startDateMonth', '$isCurrent', '$endDateYear','$endDateMonth', '$summary')");

 if (!$query) {
    die('Invalid query: ' . mysqli_error());
}

  echo "adding " . $school;
  

}
 
if ($_POST["action"] == "getprofile") {
  $idLookup = $_POST["profileID"]; 
  getTableString($idLookup, $con);

}

function getTableString($idLookup, $con){
$result = mysqli_query($con,"SELECT * FROM linkedin");
while($row = mysqli_fetch_assoc($result)) {
  $rows[] = $row;
  };
echo json_encode($rows);
    }
   
 
 
?>