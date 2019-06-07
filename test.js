// var request = require('request-promise');
// var device_id = "564944414cff0001"

// async function busca_device_data(device_id){

// 	url_request = 'http://191.252.1.150:8080/lora_server/device_data?filter='
// 	filtro = '{"devEUI":"' + device_id +'"}'
// 	var device_data
// 	await request.get({
// 	    headers: { 'Accept': 'application/hal+json, application/json, */*; q=0.01', 'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=' },
// 	    url:  url_request + filtro  ,
// 	}, function(error, response, body){
// 	    var resposta = JSON.parse(body);
// 	    if(resposta._returned > 0){
// 	    	console.log('sim');
// 	        device_data = resposta
// 	    }else{
// 	    	console.log('nao');
// 	    }
// 	}).catch(function(err){
// 		console.log(err);
// 	});

// 	return device_data

// }

// async function mostra_resultado(device_id){
// 	var result
// 	result = await busca_device_data(device_id)
// 	console.log(result._embedded.length);
// 	for(var i = 0; i < result._embedded.length; i++){
// 		console.log(result._embedded[i].rxInfo);
// 	}
// 	console.log(result);
// 	console.log('printei rxinfo');
// }


// mostra_resultado(device_id)





const express = require('express');
const app = express();
const PORT = 23000 || process.env;
const moment = require('moment')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://restheart:R3ste4rt!@191.252.1.150:27017/";


app.use(express.urlencoded({extended: true}));
app.use(express.json());



MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var dbo = db.db("lora_server");


	// app.get('/limpar', function(req, res) {
	// 	var myquery = { };
	// 	dbo.collection("device_data").deleteMany(myquery, function(err, obj) {
	// 	    if (err) throw err;
	// 	    console.log(obj.result.n + " document(s) deleted");
	// 	    res.send({"deletados": obj.result.n})
	// 	});
	// })

	app.get('*', function(req, res) {
		// dbo.collection("device_data").find({}).toArray(function(err, result) {
		// 	if (err) throw err;
		// 	res.send({"method": "GET", "resultado": result})
		// });
		res.send('<h1 style="font-size:399">OI?</h1>')
	})



	app.post('/', function(req, res) {
		var myobj = req.body
		var now = moment().format("YYYY-MM-DDTHH:mm:ss")
		myobj.date = now;
		dbo.collection("device_data").insertOne(myobj, function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");
			console.log(myobj);
			db.close();
		});
		
	})

	app.listen(PORT, function() {
	    console.log('Example app listening on port ' + PORT + '!')
	})

});




