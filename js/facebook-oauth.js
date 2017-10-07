// Constsants
const retDict = {};
const artistBase = 'https://itunes.apple.com/ca/artist/';
const imgDict = {};
const nowTime = new Date();

// used for syncing modals with images
const index = {'count': 0};

window.fbAsyncInit = function () {
  FB.init({
    appId: '1549498955130522', // our FB app
    channelUrl: 'https://urchin.holberton.us/',
    status: true, // check login status
    cookie: true,
    xfbml: true
  });

  FB.Event.subscribe('auth.authResponseChange', function (response) {
    if (response.status === 'connected') {
      document.getElementById('message').innerHTML = '<br>Connected to Facebook';
    } else if (response.status === 'not_authorized') {
      document.getElementById('message').innerHTML = '<br>Failed to Connect';
    } else {
      document.getElementById('message').innerHTML = '<br>Logged Out';
    }
  });
};

function Login () {
  FB.login(function (response) {
    if (response.authResponse) {
      getUserInfo();
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  }, {scope: 'email,user_likes,user_videos'});
}
function getUserInfo () {
  FB.api('/me', function (response) {
    let userBar = [
      '<b>Name</b> : ' + response.name + '<br>',
      '<b>id: </b>' + response.id + '<br>',
      '<input type="button" value="Get Photo" onclick="getPhoto();"/>',
      '<input type="button" value="Get Music" onclick="getMusic();"/>',
      '<input type="button" value="Logout" onclick="Logout();"/>',
      '<div id="fb_profile_image"></div>'
    ];
    document.getElementById('status').innerHTML = userBar.join('');
  });
}

function getPhoto() {
  FB.api('/me/picture?type=normal', function(response) {
    var str="<br/><b>Pic</b> : <img src='" + response.data.url + "'/>";
    document.getElementById("fb_profile_image").innerHTML = str;
  });
}

function appendToHtml (name, imageUrl) {
  let idx = index['count'];
  let portfolioModal = 'portfolioModal' + idx;
  let imageFrame = [
    '<div class="col-md-4 col-sm-6 portfolio-item">',
    '<a class="portfolio-link" data-toggle="modal" href="#' + portfolioModal + '">',
    '<div class="portfolio-hover">',
    '<div class="portfolio-hover-content">',
    '<i class="fa fa-plus fa-3x"></i>',
    '</div>',
    '</div>',
    '<img class="img-fluid" src="' + imageUrl + '">',
    '</a>',
    '<div class="portfolio-caption">',
    '<h4>' + name + '</h4>',
    '</div>',
    '</div>'
  ];

  let modalFrame = [
    '<div class="portfolio-modal modal fade" id="' + portfolioModal + '" tabindex="-1" role="dialog" aria-hidden="true">',
    '<div class="modal-dialog">',
    '<div class="modal-content">',
    '<div class="close-modal" data-dismiss="modal">',
    '<div class="lr">',
    '<div class="rl"></div>',
    '</div>',
    '</div>',
    '<div class="container">',
    '<div class="row">',
    '<div class="col-lg-8 mx-auto">',
    '<div class="modal-body">',
    '<!-- Project Details Go Here -->',
    '<h2>' + name + '</h2>',
    '<p class="item-intro text-muted">Very Cool Artist.</p>',
    '<img class="img-fluid d-block mx-auto" src="' + imageUrl + '">',
    '<p>Artist Details: Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>',
    '<ul class="list-inline">',
    '<li>Time: ' + nowTime + '</li>',
    '</ul>',
    '<button class="btn btn-primary" data-dismiss="modal" type="button">',
    '<i class="fa fa-times"></i>',
    'Close Project</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
  ];

  $(imageFrame.join('')).appendTo($('.album_images'));
  $(modalFrame.join('')).insertAfter($('.footer_modals'));
  index['count']++;
}

function parseMusicImages (artistNames) {
  for (let property in artistNames) {
    appendToHtml(property, artistNames[property]);
  }
}

function getMusic () {
  let musicList = [];
  FB.api('/me/music', function (response) {
    for (let i = 0; i < response['data'].length; i++) {
      musicList.push(response['data'][i]['name']);
    }
    let artistNames = getitunesArtistImages(musicList);
    // commented out so as to build list after every request
    // parseMusicImages(artistNames);
  });
}
function Logout () {
  FB.logout(function () { document.location.reload(); });
}

// Load the SDK asynchronously
(function (d) {
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = '//connect.facebook.net/en_US/all.js';
  ref.parentNode.insertBefore(js, ref);
}(document));

// APPLE API CHANGES

function getitunesArtistImages (artistNames) {
  for (let i=0; i < artistNames.length; i++) {
    const name = artistNames[i];
    getId(name);
  }
  for (name in retDict) {
    getImage(name, retDict[name]);
  }
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
      if (res.results[0]) {
        retDict[name] = res.results[0].artistId;
      }
      else {
        retDict[name] = "Image not available";
      }
    },
    error: function (res) {
      console.log(res);
      retDict[name] = "Image not available"
    }
  });
}

function getImage (artist, artistId) {
  $.ajax({
    async: false,
    url:  'https://itunes.apple.com/ca/artist/' + artistId,
    type: 'GET',
    success: function (res) {
      const regex = 'meta property=';
      let imageUrl = res.match('<meta property="og:image" content="([a-zA-Z0-9 :\/\.\-]+.jpg)" id="ember[0-9]+" class="ember-view">')[1];
      appendToHtml(artist, imageUrl);
      imgDict[artist] = imageUrl;
    },
    error: function (res) {
      console.log(res);
      let imageUrl = "https://vignette3.wikia.nocookie.net/canadians-vs-vampires/images/a/a4/Not_available_icon.jpg/revision/latest?cb=20130403054528";
      appendToHtml(artist, imageUrl);
      imgDict[artist] = imageUrl;
    }
  });
}
