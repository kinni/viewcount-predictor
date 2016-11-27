/**
 * Created by mewkinni on 19/11/2016.
 */

var fs = require("fs");

var csv = require("fast-csv");

var mimir = require('./mimir');
var bow = mimir.bow; // There is a special handling for Chinese character
var dict = mimir.dict;

var model = "BOW"; // You can set the model to "RAW" if you like.

// Preparing to output the csv data
var writer = csv.createWriteStream({headers: false});
var writableStream;
if (model == "RAW") {
    writableStream = fs.createWriteStream("data_raw_200.csv");
} else if (model == "BOW") {
    writableStream = fs.createWriteStream("data_bow_200.csv");
}
writer.pipe(writableStream);


var rawData = [];
var allTitles = [];

csv
    .fromPath("data_200.csv", {headers: true})
    .on("data", function (data) {


        rawData.push({viewCount: data.viewCount, title: data.title});

        // For Bag Of Words Model
        allTitles.push(data.title);

    })
    .on("end", function () {


        if (model == "RAW") {
            
            // Data out for RAW model 
            rawData.forEach(function (row) {
                writer.write(row);
            });
        } else if (model == "BOW") {

            // Data out for BOW model
            var voc = dict(allTitles);
            rawData.forEach(function (data) {
                var row = [data.viewCount, data.title];
                writer.write(row);

            });
            
        }
        
        writer.end();

        console.log("All done.");

    });