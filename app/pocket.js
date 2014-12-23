// Retrieves the length of your Pocket Unread and Archived lists
// just run using command line, and visit http://localhost:888

var pocket = require('pocket-api')
var http = require('http');

var consumer_key = '35904-bcc258c79d3c3e323583fec3';
var pocket_auth = 'https://getpocket.com/auth/authorize?';
var secret;
var access_token;
var user;

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});

	pocket.getAccessToken( consumer_key , secret, function( data ) {
		access_token = data.access_token;
		user = data.user;
		res.write(JSON.stringify(data) + "\n");
		
		pocket.getArticles(consumer_key, access_token, "&state=unread", function( error, data ) {
			console.log(error);
			res.write(Object.keys(data.list).length + "\n");
			pocket.getArticles(consumer_key, access_token,"&state=archive", function( error, data ) {
				console.log(error);
				res.write(Object.keys(data.list).length + "\n");
				res.write(JSON.stringify(data) + "\n");
				res.end();
			});
		});

		
	});
	
}).listen(887, 'localhost');
console.log('Server running at http://localhost:887/');

http.createServer(function (req, res) {
	pocket.getRequestToken( consumer_key , function( data ) {
		console.log( data );
		secret = data.code;
		res.writeHead(302, {
			'Location': pocket_auth + "request_token="+ secret + "&redirect_uri=" + encodeURIComponent('http://localhost:887')
		});
		res.end();
	});	
}).listen(888, 'localhost');
console.log('Server running at http://localhost:888/');



/*
pocket.getArticles( consumer_key , access_token, function( error, data ) {
    console.log( error, data );
    //returns articles
});

pocket.addArticles( url-to-add, consumer_key , access_token, function( error, data ) {
    console.log( error, data );
});

pocket.modifyArticles( actions, consumer_key , access_token, function( error, data ) {
    console.log( error, data )
});

*/