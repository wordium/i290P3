$.getJSON("http://api.sqoot.com/v2/deals?api_key=dh6h5k")            // Sad panda    (404)
$.getJSON("http://api.sqoot.com/v2/deals?api_key=dh6h5k&callback=pickles") // Awesomesauce (200)


$(document).ready(function() {

    $('#test').submit(function(e) {

        var url = 'http://api.sqoot.com/v2/categories';
        $.getJSON(url, function(data) {
            console.log(data);
        }

    });
        //PART 1
        //1. Write an event handler for the "loadBookmarks" form submit event. 
        //2. In the event handler, create an AJAX request using JSONP to GET all bookmarks for the given user name
        //   The format of the URL is http://feeds.delicious.com/v2/json/' + username + '?callback=?' 
        //   See http://api.jquery.com/jQuery.getJSON/ for more information getJSON with JSONP
        //3. In the AJAX callback function, add all of the bookmarks to the #bookmarks list. You may want to console.log the result first to
        //   see what you're getting back frm the API. Then, use the helper function below
        //   to generate a single list item for each bookmark object
/*
        $('#loadBookmarks').submit(function(e) {

            var username = $('#sourceUser').val();
            var url = 'http://feeds.delicious.com/v2/json/' + username + '?callback=?';

            $.getJSON(url, function(data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    var li = generateBookmarkListItem(data[i]);
                    $('#bookmarks').append(li);
                }
            });

            return false;
            
        });

        //PART 2
        //1. Write another form event handler, this time for the "saveBookmarks" form. 
        //2. In the event handler, create an AJAX request to POST each of the checked bookmarks to the second Delicious account
        //    by way of the the proxy file you uploaded to your ISchool account.
        //    You'll need to extract the url and tags back from each bookmark <li>
        //    Review http://delicious.com/developers to figure out which API method to use and what parameters are required

        //IMPORTANT NOTE: In order to test the request, you will need to Upload the contents of this lab (browser.html, js directory, 
        //css directory) and run it from the web (ex. http://people.ischool.berkeley.edu/~yourname/browser.html) 

        //PART 3 (Advanced/Extra)
        //1. Edit the HTML of the form and modify your JavaScript code to allow the user to add new tags to the selected bookmarks
        //
        

        $('#saveBookmarks').submit(function() {

            var listItems = $('li');
            
            var user = $('#targetUser').val();
            var pass = $('#password').val();

            listItems.each(function() {

                if ($(this).find(':checked').length > 0) {
                    
                    var deliciousData = {
                        username : user,
                        password : pass,
                        method : 'posts/add',
                        url : $(this).find('a').attr('href'),
                        tags : $(this).find('.tags').text()
                    }


                    $.ajax({
                        url: 'delicious_proxy.php',
                        type: 'post',
                        data: deliciousData,
                        success: function(data) {
                            if (data.result_code == "done") {
                                alert("Bookmarks were successfully posted to delicious");
                            }
                        }, error: function(e){
                            console.log(e);
                        }

                    });
                }

            });

            return false;


        });

        //PART 3 (If you have time)
        //1. Edit the HTML of the form and modify your JavaScript code to allow the user to add new tags to the selected bookmarks
        //


        function generateBookmarkListItem(markObj) {
            // markObj.u = url
            // markObj.t = array of tags

            var listItem = $('<li><div><input type="checkbox"> <a href="' + markObj.u + '">' + markObj.u + '</a></div><span class="tags">' + markObj.t + '</span></li>');
            return listItem;

        }

    */
});