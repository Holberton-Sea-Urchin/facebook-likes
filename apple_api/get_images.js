//artistNames = ['Jack Johnson', 'Cold play', 'Taylor Swift']
retDict = {};
artistBase = 'https://itunes.apple.com/ca/artist/';
imgDict = {};

//getitunesArtistImages(['Taylor Swift', 'Green Day', 'Michael Jackson']);
function getitunesArtistImages (artistNames) {
  for (let i=0; i < artistNames.length; i++) {
    const name = artistNames[i];
    getId(name);
  }

  for (name in retDict) {
    getImage(name, retDict[name]);
  }
  console.log(imgDict);
  return imgDict;
}
function getId (name) {
  $.ajax({
    async: false, 
    url: 'https://itunes.apple.com/search\?term\=' + name,
    type: 'GET',
    contentType: 'application/json',
    dataType: 'json',
    success: function (res) {
      retDict[name] = res.results[0].artistId;
    }
  });
}

function getImage (artist, artistId) {
  console.log(artist);
  console.log(artistId);
  $.ajax({
    async: false, 
    url:  'https://itunes.apple.com/ca/artist/' + artistId,
    type: 'GET',
    success: function (res) {
       const regex = 'meta property=';
       imgURL = res.match('<meta property="og:image" content="([a-zA-Z0-9 :\/\.\-]+.jpg)" id="ember[0-9]+" class="ember-view">')[1];
       imgDict[name] = imgURL;
       
    },
    error: function (res) {
      console.log('ERROR!!!!');
    }
  });
}
