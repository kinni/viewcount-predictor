/**
 * Created by mewkinni on 19/11/2016.
 */

// Load the 200 samples
var fs = require("fs");
var data = fs.readFileSync("./raw_data_200.txt");
data = JSON.parse(data);

// Package needed for BOW model
var mimir = require('mimir');
var bow = mimir.bow;
var dict = mimir.dict;
var voc = dict(data);

var express = require("express");
var bodyParser = require('body-parser');
var gcloud = require("google-cloud");
var prediction = gcloud.prediction;

// Initialize Prediction API
var predictionClient = prediction({
    projectId: 'REPLACE_YOUR_PROJECT_ID',
    keyFilename: 'PATH_TO_YOUR_KEY.json'
});


// Set our prediction model
var model = predictionClient.model('bow_model_200');

// Setup the web server
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Serve the static html
app.use(express.static('./public'));

// We have only one API request
app.post('/predict', function (req, res) {

    var text = req.body.text;
    if (text == undefined || text.length < 1) {
        return res.status(500).send({err: 'text cannot be empty'});
    }

    // Transforming from text to numeric representation
    var query = bow(text, voc);

    model.query(query, function (err, results) {
        console.log(err);
        res.send(results);
    });

});

// Start listening at port 3000
app.listen(3000, function (err) {
    if (!err) {
        console.log("Server starts at port 3000");
    }
});