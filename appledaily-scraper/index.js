/**
 * Created by mewkinni on 17/11/2016.
 */
var fs = require("fs");

var request = require("request");
var cheerio = require("cheerio");
var moment = require("moment");
var async = require("async");
var csv = require("fast-csv");

var writer = csv.createWriteStream({headers: true});
var writableStream = fs.createWriteStream("data_200_raw.csv");
writer.pipe(writableStream);

var scrapCount = 0;

function scrapNewspage(url, callback) {

    request.get(url, function (err, res, body) {

        if (err) {
            callback(err);
            return;
        }

        var $ = cheerio.load(body);

        // We only extract the date, title and the viewCount data
        var date = $('div.SelectHdate').text().trim();
        var title = $('table.LinkTable').find('h1').text().trim();
        var viewCount = parseInt($('table.LinkTable').find('div.view').text().trim().replace(",", ""));

        if (!date || !title || !viewCount) {
            callback("Unknow error");
            return;
        }

        writer.write({id: scrapCount++, date: date, title: title, viewCount: viewCount});

        console.log(scrapCount + "; " + "(" + date + ")" + title + ": " + viewCount);

        callback();

    });

}

function seed(url, callback) {

    request.get(url, function (err, res, body) {

        if (err) {
            callback(err);
            return;
        }

        var $ = cheerio.load(body);
        
        // Extract all the links for news articles
        var allLinks = $('div.Archive').find('li');
        async.eachLimit(allLinks, 8, function (link, next) {

            
            // We use 200 articles only because we want quick results from Google Prediction API
            // For 200 raw Chinese articles, it takes around 1 hour for Google Prediction API to process;
            // For 200 Bag-Of-Words model Chinese articles, it takes around 0.5 hour for Google Prediction API to process.
            if (scrapCount>200){
                return false;
            }
            
            var newsUrl = $(link).children('a').attr('href');
            scrapNewspage(newsUrl, next);

        }, callback);


    });

}

var startDate = moment('20161118', "YYYYMMDD");
async.timesSeries(365, function (n, next) {

    // Scrape the articles day by day
    var date = startDate.subtract(1, 'days').format("YYYYMMDD");
    seed("http://hk.apple.nextmedia.com/archive/index/" + date + "/index/", next);

}, function (err) {

    writer.end();
    
    if (err) {
        console.log(err);
    } else {
        console.log("All Done without error.");    
    }
    
});



