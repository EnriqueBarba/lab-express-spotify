require('dotenv').config()

const express = require('express');
const bodyParser  = require("body-parser");
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get('/', (req, res, next) => {
  const data = {}
  res.render('home', data);
})

app.post('/artists', (req, res) => {
    console.log(`Request: ${req.body.artist}`);
      spotifyApi
      .searchArtists( req.body.artist )
      .then(data => {
        //console.log("The received data from the API: ", data.body);
        const artists = data.body.artists.items
        res.render('artists', artists)
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      });
    
})

app.get('/albums/:id', (req, res, next) => {
  const param = req.params
  console.log(param.id)
  spotifyApi
  .getArtistAlbums( param.id )
  .then(data => {
    console.log(data)
    const albums = data.body.items
    console.log(albums)
    res.render('albums', albums);
  }).catch(err => {
    console.log("The error while searching albums occurred: ", err);
  });

})




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
