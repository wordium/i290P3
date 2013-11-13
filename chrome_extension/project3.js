chrome.extension.onMessage.addListener(function (msg, _, sendResponse) {
    console.log(msg);
    //getting position history
    for (j in msg.data[0].positionHistory) {
        profile = [];
        profile.push({
            picURL : msg.data[0].picURL,
            name : msg.data[0].name,
            username : msg.data[0].profileUsername,
            profileID : msg.data[0].id,
            title : msg.data[0].positionHistory[j].title,
            subTitle : msg.data[0].positionHistory[j].subTitle,
            companyName : msg.data[0].positionHistory[j].companyName,
            companyIndustry : msg.data[0].positionHistory[j].companyIndustry,
            location : msg.data[0].positionHistory[j].companyLocation,
            startDateYear : msg.data[0].positionHistory[j].startDateYear,
            startDateMonth : msg.data[0].positionHistory[j].startDateMonth,
            endDateIsCurrent : msg.data[0].positionHistory[j].isPositionCurrent,
            endDateYear : msg.data[0].positionHistory[j].endDateYear,
            endDateMonth : msg.data[0].positionHistory[j].endDateMonth,
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
            username : msg.data[0].profileUsername,
            profileID : msg.data[0].id,
            title : msg.data[0].educationHistory[j].title,
            subTitle : msg.data[0].educationHistory[j].subTitle,
            companyName : msg.data[0].educationHistory[j].companyName,
            companyIndustry : msg.data[0].educationHistory[j].companyIndustry,
            startDateYear : msg.data[0].educationHistory[j].startDateYear,
            startDateMonth : msg.data[0].educationHistory[j].startDateMonth,
            endDateIsCurrent : msg.data[0].educationHistory[j].isPositionCurrent,
            endDateYear : msg.data[0].educationHistory[j].endDateYear,
            endDateMonth : msg.data[0].educationHistory[j].endDateMonth,
            location : msg.data[0].educationHistory[j].companyLocation,
            summary : msg.data[0].educationHistory[j].summary  
        });
        
        profilePHP = JSON.stringify(profile);
        console.log(profilePHP);
        educationSendToPHP(profilePHP);
    };


});

function educationSendToPHP (object) {
        // When page loads, POST bizId & reviewList, and fetch data
    $.ajax({
        type:"post",
        url:"http://people.ischool.berkeley.edu/~jenton/iolab_p3/phpSaveToDB.php",
        data:"action=educationinfo"+"&profile="+object
    })
        .done(function(data){
            $('#div1').append(data + "<br />");
            //console.log(data);
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
        url:"http://people.ischool.berkeley.edu/~jenton/iolab_p3/phpSaveToDB.php",
        data:"action=positioninfo"+"&profile="+object
    })
        .done(function(data){
            $('#div1').append(data + "<br />");
            //console.log(data);
            //updateCounts(data);

        })
        .fail(function(data){
            console.log("fail");
        });
}