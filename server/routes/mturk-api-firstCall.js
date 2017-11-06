var AWS = require('aws-sdk');
var region = 'us-east-1';
var aws_access_key_id = 'AKIAINJT6YTLRJMBWOWA';
var aws_secret_access_key = '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';

AWS.config = {
    "accessKeyId": aws_access_key_id,
    "secretAccessKey": aws_secret_access_key,
    "region": region,
    "sslEnabled": 'true'
};

var endpoint = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com';

// Uncomment this line to use in production
// endpoint = 'https://mturk-requester.us-east-1.amazonaws.com';

var mturk = new AWS.MTurk({ endpoint: endpoint });

// This will return $10,000.00 in the MTurk Developer Sandbox
mturk.getAccountBalance(function(err, data){
    console.log(data.AvailableBalance);
});


// Xinyi: AWS SDK for JavaScript in Node.js

// var AWS = require('aws-sdk');

var s3 = new AWS.S3();

// Bucket names must be unique across all S3 users

var myBucket = 'testingBucket1';

var myKey = 'testingBucket1_key';

s3.createBucket({Bucket: myBucket}, function(err, data) {

if (err) {

   console.log(err);

   } else {

     params = {Bucket: myBucket, Key: myKey, Body: 'Hello!'};

     s3.putObject(params, function(err, data) {

         if (err) {

             console.log(err)

         } else {

             console.log("Successfully uploaded data to myBucket/myKey");

         }

      });

   }

});