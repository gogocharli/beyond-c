'use strict';

// Require environment variables for API keys
require('dotenv').config();

const Base64 = require('js-base64').Base64;
const fetch = require('node-fetch');

// Beyonce's artist Id on Spotify
const BEYONCE_ARTIS_ID = '6vWDO969PvNqNYHIOW5v0m';
const SPOTIFY_RATE_LIMIT = 50;
const REQUEST_URL =
  'https://api.spotify.com/v1/search?q=Beyonce&type=track&market=US&limit=50&offset=';

async function getBeyonce() {
  const token = await getToken();
  const tracks = await getTracks(token, 4);
  const beyonceTracks = mapData(tracks);
  console.log(
    'Node caters to you! 😌 I have successfuly retrieved',
    beyonceTracks.length,
    'Beyoncé tracks',
  );
  return beyonceTracks;
}

// Get the access token using the client credentials auth flow
async function getToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Base64.encode(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET,
      )}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: 'grant_type=client_credentials',
  });
  const tokenResponse = await res.json();
  return tokenResponse['access_token'];
}

// Search for tracks belonging to the artist
async function getTracks(token, offsetMax = 1) {
  let tracks = [];

  // Since the API limit for this query is 50 results, I am making it multiple times to get enouth items
  let offset = 0;
  for (let i = 0; i < offsetMax; i++) {
    const res = await fetch(`${REQUEST_URL}${offset}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    const currentTracks = data.tracks.items;
    // Use the old tracks array and append the newly recieved set of results
    tracks = [...tracks, ...currentTracks];
    offset += SPOTIFY_RATE_LIMIT;
  }
  return tracks;
}

// Map the data to an object I can work with. While recieving an array of the tracks
function mapData(tracks = []) {
  const trackIDs = [];
  // Tracks is an array of IDs of the different Beyonce tracks as IDs
  for (let track of tracks) {
    // Check if the Beyonce ID matches with one of the artists
    for (let { id } of track.artists) {
      if (id == BEYONCE_ARTIS_ID) trackIDs.push(track.id);
    }
  }
  return trackIDs;
}

module.exports = getBeyonce();
