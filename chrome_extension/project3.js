chrome.extension.onMessage.addListener(function (msg, _, sendResponse) {
    //console.log(msg.data);
    // profilePHP = msg.data; for linked db tables
    
    //for one db table
    /*
    picURL = msg.data[0].picURL;
    name = msg.data[0].name;
    profileID = msg.data[0].id;
    */

    //getting position history
    for (j in msg.data[0].positionHistory) {
        profile = [];
        profile.push({
            picURL : msg.data[0].picURL,
            name : msg.data[0].name,
            profileID : msg.data[0].id,
            title : msg.data[0].positionHistory[j].title,
            subTitle : "",
            companyName : msg.data[0].positionHistory[j].company.name,
            companyIndustry : msg.data[0].positionHistory[j].company.industry,
            location : msg.data[0].positionHistory[j].company.location,
            startDateYear : msg.data[0].positionHistory[j].startDate.year,
            startDateMonth : msg.data[0].positionHistory[j].startDate.month,
            endDateIsCurrent : msg.data[0].positionHistory[j].endDate.isCurrent,
            endDateYear : msg.data[0].positionHistory[j].endDate.year,
            endDateMonth : msg.data[0].positionHistory[j].endDate.month,
            summary : msg.data[0].positionHistory[j].summary  
        });
        
        profilePHP = JSON.stringify(profile);
        positionSendToPHP(profilePHP);
    };
    //getting education history
    for (j in msg.data[0].educationHistory) {
        profile = [];
        profile.push({
            picURL : msg.data[0].picURL,
            name : msg.data[0].name,
            profileID : msg.data[0].id,
            title : msg.data[0].educationHistory[j].title,
            subTitle : msg.data[0].educationHistory[j].subTitle,
            companyName : msg.data[0].educationHistory[j].company.name,
            companyIndustry : "",
            startDateYear : msg.data[0].educationHistory[j].startDate.year,
            startDateMonth : msg.data[0].educationHistory[j].startDate.month,
            endDateIsCurrent : "0",
            endDateYear : msg.data[0].educationHistory[j].endDate.year,
            endDateMonth : msg.data[0].educationHistory[j].endDate.month,
            location : msg.data[0].educationHistory[j].location,
            summary : msg.data[0].educationHistory[j].summary  
        });
        
        profilePHP = JSON.stringify(profile);
        educationSendToPHP(profilePHP);
    };


    

/* for linked db tables
    //console.log(picURL + name + profileID);
    // When page loads, POST bizId & reviewList, and fetch data
    $.ajax({
        type:"post",
        url:"http://people.ischool.berkeley.edu/~jenton/iolab_p3/phpScript.php",
        data:"action=profileinfo"+"&profile="+profilePHP
    })
        .done(function(data){
            console.log("success");
            console.log(data);
            //updateCounts(data);

        })
        .fail(function(data){
            console.log("fail");
        });
*/
    /*for (i in msg.data) {
            picURL = msg.data.picURL;            
            $("#div1").append("<p><img src='" + msg.data[i].picURL + "'></p>");
            $("#div1").append("<p>" + msg.data[i].name + "</p>");
            $("#div1").append("<p>" + msg.data[i].id + "</p>");
            for (j in msg.data[i].educationHistory) {
            //console.log(msg.data[i].positionHistory);
              console.log(msg.data[i].educationHistory[j].company.name);
              $("#div1").append("<p>" + msg.data[i].educationHistory[j].company.name + "</p>");
              $("#div1").append("<p>" + msg.data[i].educationHistory[j].title + "</p>");
              //$("#div1").append("<p>" + msg.data[i].positionHistory) + "</p>");
            }
        }
        */

});

function educationSendToPHP (object) {
        // When page loads, POST bizId & reviewList, and fetch data
    $.ajax({
        type:"post",
        url:"http://people.ischool.berkeley.edu/~jenton/iolab_p3/phpScript.php",
        data:"action=educationinfo"+"&profile="+object
    })
        .done(function(data){
            console.log(data);
            //updateCounts(data);

        })
        .fail(function(data){
            console.log("fail");
        });
}

function positionSendToPHP (object) {
        // When page loads, POST bizId & reviewList, and fetch data
    $.ajax({
        type:"post",
        url:"http://people.ischool.berkeley.edu/~jenton/iolab_p3/phpScript.php",
        data:"action=positioninfo"+"&profile="+object
    })
        .done(function(data){
            console.log(data);
            //updateCounts(data);

        })
        .fail(function(data){
            console.log("fail");
        });
}