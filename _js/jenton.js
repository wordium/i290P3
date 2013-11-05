$(document).ready(function() {

        //global variable _map stores map object
        _map = initializeMap();

        //keep track of the currently open infowindow so we don't open more than once
        _openWindow = null;

        var url = 'http://api.sqoot.com/v2/deals?api_key=dh6h5k&per_page=20&radius=100&location=Berkeley';
        $.getJSON(url, function(data) {
            for (i in data.deals) {
                //console.log(data.deals[i].deal);

                var dealData = {
                    merchant_name : data.deals[i].deal.merchant.name,
                    merchant_lat : data.deals[i].deal.merchant.latitude,
                    merchant_long : data.deals[i].deal.merchant.longitude,
                    deal_id : data.deals[i].deal.id,
                    title : data.deals[i].deal.title,
                    providerName : data.deals[i].deal.provider_name,
                    category : data.deals[i].deal.category_name,
                    price : data.deals[i].deal.price
               
                }
                console.log(data.deals[i].deal.merchant.name);

                createMarker(dealData);
                //console.log(dealData);
                //console.log(data.query.deals[i].title);
                
                //output data in dealData to HTML
                for (i in dealData) {
                $('#profiles').append("<p>" + i + " : " + dealData[i] + "</p>");           
                }
                $('#profiles').append("<hr />");

                
            }
            console.log(data);            
        });
        
});

function initializeMap() {
    //return map object

    var berkeley = new google.maps.LatLng(37.8717, -122.2728);
    var mapOptions = { 
        center: berkeley, 
        zoom: 8, 
        mapTypeId:google.maps.MapTypeId.ROADMAP 
    } 
    var berkeleyMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions); 
    return berkeleyMap;
}

function createMarker(deal) {
    var myLatlng = new google.maps.LatLng(deal.merchant_lat,deal.merchant_long);
    var title = "<h1>" + deal.merchant_name + "</h1>";
    /*var titleString;
    for (i in deal) {
        titleString = titleString + 
    }*/
    var infoWindow = new google.maps.InfoWindow({ 
        content: title 
    });
    var marker = new google.maps.Marker({
        position: myLatlng,
        title: "Merchant Name: " + deal.merchant_name,
        map: _map
    });
    
    google.maps.event.addListener(marker, "click", function() {
            if (_openWindow != null) {
                _openWindow.close();
            }

            infoWindow.open(_map, marker);
            _openWindow = infoWindow;
        });

}