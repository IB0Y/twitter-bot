require('dotenv').config();
const twit = require('./twit');
const fs = require('fs');
const path = require('path');

const paramsPath = path.join(__dirmane, 'params.json');

// functions to record last tweet read tweet id
const writeParams = (data) => {
  console.log("writing to params file...");
  return fs.writeFileSync(paramsPath, JSON.stringify(data));
}

// functions to reads from params file
const readParams = () => {
  console.log("Reading params file...");
  let data = fs.readFileSync(paramsPath);

  return JSON.parse(data.toString());
}

// function to get(read ) twits
const getTweets = (queryParam, since_id) => {
  return new Promise((resolve, reject) => {
    let params = {
        q: queryParam,
        count: 10
    }

    if (since_id) {
      params.since_id = since_id;
    }

    twit.get("search/tweets", params, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
}

// function to post tweets
const postTweet = (id) => {
  return new Promise((resolve, reject) => {
    let params = {
      id
    }

    twit.post('statuses/retweet/:id', params, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
}

//Get data from api
const fetchData = async () => {
  const config = {
    headers: {
      "Authorization": ""
    }
  }

  try {
    let { data } = await axios.get('/',{ params } config);
    if (data) {
      return data;
    }
  } catch (e) {
    console.log(e);
  }
}

// Bot
const main = async () => {
  try {
    let params = readParams();
    let data =  await getTweets("#entryleveldeveloper", params.since_id);
    const tweets = data.statuses;
    console.log("We got tweets", twee.length);

    for await( let tweet of tweets) {
      try {
        await postTweet(tweet.id_str);

        console.log("Successful retweet" + tweet.id_str);
      } catch (e) {
        console.log("Unsuccesful retweet" + tweet.id_str);
      }

      params.since_id = tweet.id_str;
    }
    writeParams(params);
  } catch (e) {
    console.log(e);
  }
}

console.log("Starting the twitter bot...");

setInterval(main, 10000);
