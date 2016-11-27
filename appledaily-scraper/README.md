# Apple Daily Scraper

A simple Nodejs application to scrape the the news article title and view count from Apple Daily.

## Installing

```
npm install 
```

## Running the scraper

The scraper will scrape the news from 2016/11/18 in reverse chronological order.

```
node index.js 
```

## Running the processor

The processor will transform the scraped data in to a csv file which will later upload to Google Prediction API.

1. Select language model, Bag-of-words (BOW) or Raw. 
```
var model = "BOW"; // You can set the model to "RAW" if you like. 
``` 
 
2. Run the processor
```
node processor.js 
```

3. The data file, neither data_bow_200.csv (BOW model) or data_raw_200.csv (RAW model) generated.


## Upload the data file to Google Cloud Prediction API 

You may find the detailed steps here: https://cloud.google.com/prediction/docs/quickstart.

