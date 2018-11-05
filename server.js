'use strict';
const Twit       = require('twit');
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const corser     = require('corser');
const config     = require('./config/config.json');
const router     = express.Router();
/**
 * Twitter Oauth sample
 */
const T = new Twit({
  consumer_key:         config.twitter.consumer_key,
  consumer_secret:      config.twitter.consumer_secret,
  access_token:         config.twitter.access_token,
  access_token_secret:  config.twitter.access_token_secret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});
/**
 * Define server listen port
 */
app.set('port', (process.env.PORT || config.server.port));
/**
 * Parser json request server
 */
app.use(bodyParser.json({ extended: true }));
/**
 * Corser allow all origins
 */
// app.use(corser.create());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.static('./public'));
/**
 * Endpoints
 */
app.get('/',  (req, res) => {
  res.sendFile('./public/index.html');
});
app.get('/twet/:word', (req, res, next) => {
  const word = req.params.word;
  return T.get('search/tweets', { q: word, count: 10, language: 'es' }, function(err, data, response) {
    const hashTags = [];
    data.searchWord = word;
    // Collect all hashtags to root level
    data.statuses.map(tweet => {
      if (tweet.entities && tweet.entities.hashtags) {
        tweet.entities.hashtags.map(hashtag =>  {
          hashTags.push(hashtag);
        });
      }
    });
    data.hashTags = hashTags;
    res.send(data);
  });
});

app.listen(app.get('port'), (err) => {
  if(!err){
    console.log(`Server listen on port: ${app.get('port')}`);
  }
});
