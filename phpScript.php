<?php
 // connects to my ischool mysql database. username: jenton, password: qwerty, database: jenton
  $con = mysqli_connect("localhost", "jenton", "qwerty", "jenton");
 
 // Failure check
if (mysqli_connect_errno($con))
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
 
if ($_POST["action"] == "getprofile") {
  $usernameLookup = $_POST["username"]; 
  getTableString($usernameLookup, $con);

}

function getTableString($usernameLookup, $con){
$result = mysqli_query($con,"SELECT * FROM linkedin WHERE username = '$usernameLookup'");
while($row = mysqli_fetch_assoc($result)) {
  $rows[] = $row;
  };
echo json_encode($rows);
    }
   
 
 
?>