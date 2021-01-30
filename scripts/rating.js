// The number of tracks from Beyoncé we retrieved from the backend
let trackCount = 0;

// A regular expression to get the token from the callback url
let token;

// Get the IDs to check against the user's saved tracks
const getIDs = async function () {
  const res = await fetch('/Day-4/tracks.json');
  const data = await res.json();
  let trackIDs = [];

  // Place every track in the new array in chuncks of 50
  while (data.length) {
    trackIDs.push(data.slice(0, 50));
    data.splice(0, 50);
  }
  trackCount = trackIDs.flat().length;
  return trackIDs;
};

// Check if the user saved tracks contain all Beyonce songs
const checkTracks = async function (tracks) {
  // Since the API limit for this query is 50 results, I am making it multiple times to get all the results
  let results = [];

  // Make enough calls to verify the user's library against all the tracks
  for (let i = 0; i < tracks.length; i++) {
    const res = await fetch(
      `https://api.spotify.com/v1/me/tracks/contains?ids=${tracks[i].join()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();

    // Update the results array for every call made to the API
    results = await [...results, ...data];
  }

  // Return the number of positive results
  return results.filter((el) => el).length;
};

// Assign a score based on the number of positive results obtained
const calculateScore = function (count) {
  const total = trackCount;
  return Math.floor((count * 100) / total);
};

const giveRanking = function (score) {
  let ranking;
  if (score < 20) {
    ranking = 'Larvae';
  } else if (score >= 20 && score < 40) {
    ranking = 'Forager Bee';
  } else if (score >= 40 && score < 60) {
    ranking = 'House Bee';
  } else if (score >= 60 && score < 80) {
    ranking = 'Worker Bee';
  } else if (score >= 80) {
    ranking = 'Soldier Bee';
  }
  return ranking;
};

const increment = function (el, value) {
  // Use setTimeout to increment the number inside the element from 0 to the value
  let current = 0;
  const updateInterval = setInterval(() => {
    el.innerText = `${current}`;
    current++;

    if (current > value) {
      clearInterval(updateInterval);
    }
  }, 75);
};

// Show the appropriate ranking and score to the user
const updateRanking = function (userCount) {
  // Calculate the score
  const score = calculateScore(userCount);

  // Attribute a ranking and return a string
  const ranking = giveRanking(score);

  // Update the DOM with appropriate results
  const rankingText = document.querySelector('.ranking');
  const rankingSpan = rankingText.querySelector('span');
  const scoreEl = document.querySelector('.score span');

  rankingText.innerHTML = `<span>You are a…</span>${ranking}`;

  // Increment the value inside this span until it reaches the score
  increment(scoreEl, score);
};

// In case of an error, make sure to notify the user appropriately
const handleError = function (error) {
  // Notify the user
  const rankingText = document.querySelector('.ranking');
  rankingText.innerHTML = `<span>There was a problem</span>Oopsie!`;

  // Console log the error
  console.log(error);
};

async function rateUser() {
  try {
    // Update the token value
    token = new window.URLSearchParams(window.location.href).get(
      'access_token',
    );

    // Get and update the score
    const beyonceTracks = await getIDs();
    const userCount = await checkTracks(beyonceTracks);
    updateRanking(userCount);
  } catch (err) {
    handleError(err);
  }
}

export { rateUser };
