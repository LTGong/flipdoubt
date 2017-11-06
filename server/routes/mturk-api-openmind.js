var mturk = require('mturk-api');

var config = {
    access : 'AKIAINJT6YTLRJMBWOWA',
    secret : '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',
    sandbox: true
}


mturk.createClient(config).then(function(api){


  api.req('GetAccountBalance').then(function(res){
    //Do something
  }).catch(console.error);


  //Example operation, with params
  api.req('SearchHITs', { PageSize: 100 }).then(function(res){
     //Do something
  }).catch(console.error)


  //MTurk limits the velocity of requests. Normally,
  //if you exceed their request rate-limit, you will receive a
  //'503 Service Unavailable' response. As of v2.0, our interface
  //automatically throttles your requests to 3 per second.
  for(var i=1; i < 20; i++){
    //These requests will be queued and executed at a rate of 3 per second
    api.req('SearchHITs', { PageNumber: i }).then(function(res){
      //Do something
    }).catch(console.error);
  }


}).catch(console.error);