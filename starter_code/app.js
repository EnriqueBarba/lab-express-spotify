require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
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

app.get('/artists', (req, res) => {
  const data = {artist_name: req.query.artist_name}
  console.log(`Artist name: ${data.artist_name}`);
    spotifyApi
    .searchArtists( data.artist_name )
    .then(data => {
      const artists = data.body.artists.items
      console.log(`Artists: ${artists}`);   
      res.render('artists', artists)
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
  
})

app.get('/albums/:id', (req, res, next) => {
  const param = req.params
  console.log(`Artist ID: ${param.id}`)
  spotifyApi
  .getArtistAlbums( param.id )
  .then(data => {
    const albums = data.body.items
    console.log(`Albums: ${albums}`)
    console.log(albums[0])
    res.render('albums', albums);
  }).catch(err => {
    console.log("The error while searching albums occurred: ", err);
  });

})

app.get('/tracks/:id', (req, res, next) => {
  const param = req.params
  console.log(`Album ID: ${param.id}`)
  spotifyApi
  .getAlbumTracks( param.id )
  .then(data => {
    const tracks = data.body.items
    console.log(`Tracks: ${tracks}`)
    res.render('tracks', tracks);
  }).catch(err => {
    console.log("The error while searching tracks occurred: ", err);
  });

})

/*
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
    
}) */

app.listen(3000, () => console.log("Project running on port 3000"));
