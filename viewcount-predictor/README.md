# Viewcount Predictor

This is the web app serving as the web interface to interact with Google Cloud Prediction API

## Installing

```
npm install
```

## Running the project 

1. Replace the following with your Google Cloud Project ID and key file.
```
// Initialize Prediction API
var predictionClient = prediction({
    projectId: 'REPLACE_YOUR_PROJECT_ID',
    keyFilename: 'PATH_TO_YOUR_KEY.json'
});
```

2. Run the server
```
node index.js
```

3. Go to the http://localhost:3000
