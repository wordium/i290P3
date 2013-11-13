


$(document).ready(function(){
	console.log("Smelly!");
$('a').on('mousedown', function(){
	//alert($(this).attr('href'));
	alert("sup sup");
	chrome.windows.create({
  	url: "http://www.google.com",
  	incognito: true
	});
});
//alert($(this).attr('href'));

});