


$(document).ready(function() {

        //$.getJSON("http://api.sqoot.com/v2/deals?api_key=dh6h5k")            // Sad panda    (404)
        //$.getJSON("http://api.sqoot.com/v2/deals?api_key=dh6h5k&callback=pickles") // Awesomesauce (200)
        var url = 'http://api.sqoot.com/v2/deals?api_key=dh6h5k';
        $.getJSON(url, function(data) {
            for (i in data.deals) {
                //console.log(data.deals[i].deal);

                var dealData = {
                    id : data.deals[i].deal.id,
                    title : data.deals[i].deal.title,
                    providerName : data.deals[i].deal.provider_name,
                    category : data.deals[i].deal.category_name,
                    price : data.deals[i].deal.price
                }

                //console.log(dealData);
                //console.log(data.query.deals[i].title);
                for (i in dealData) {
                $('#profiles').append("<p>" + i + " : " + dealData[i] + "</p>");           
                }
                $('#profiles').append("<hr />");

                
            }
            console.log(data);            
        });
        
});