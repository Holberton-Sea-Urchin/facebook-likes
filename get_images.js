artistNames = ['Jack Johnson', 'Cold play', 'Taylor Swift']
retDict = {};
artistBase = 'https://itunes.apple.com/ca/artist/';

getImage('fhdjska');

for (let i=0; i < artistNames.length; i++) {
  const name = artistNames[i];
  getId(name);
}

const testId = retDict['Jack Johnson'];

getImage(retDict['Jack Johnson']);

for (name in retDict) {
//  console.log(retDict[name])
}


/*
  $.get ('https://itunes.apple.com/search\?term\=' + artistNames[i], function (data) {
    const results = JSON.parse(data).results;
    const artistId = results;
    retDict[name] = results[i].artistId;
    console.log(retDict);

  });
*/
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

  console.log(retDict);

function getImage (artistId) {

  $.ajax({
    async: false, 
    url:  'https://itunes.apple.com/ca/artist/909253',
//    url: 'artistBase' + retDict[artistId],
    type: 'GET',
    success: function (res) {
       imgURL = res.match('<meta content=\"[a-zA-Z0-9 :\/\.\-]+.jpg\" property=\"og:image\" \/>')[0];
       console.log(imgURL);
    },
    error: function (res) {
      console.log('ERROR!!!!');
    }
  });
}
//}


//<meta property="og:image" content="https://is3-ssl.mzstatic.com/image/thumb/Music128/v4/5f/9e/f0/5f9ef07f-a666-cf03-7c84-c858dce2eb40/source/1200x630sr.jpg" id="ember13122855" class="ember-view">

// https?:\/\/?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)
