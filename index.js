var $ = require('jquery');
var request = require('superagent-bluebird-promise');
window.jQuery = $;
require('jquery-clock-timepicker/jquery-clock-timepicker.min.js');
var timestamp = require('time-stamp');
var timescale = require('timescale');

window.myMap = function() {
  request.get('https://ostlerapi.herokuapp.com/api/garages').promise()
  .then( (data)=> {
    return data.body
  })
  .then((data)=>{
    var mapCanvas = document.getElementById("map");
    var myCenter = new google.maps.LatLng(data[0].latitude,data[0].longitude);
    var mapOptions = {
      center: myCenter,
      zoom: 12,
    };
    var map = new google.maps.Map(mapCanvas,mapOptions);
    if (mapCanvas) {
      setMarkers(map, data);
    }
  })
}

function setMarkers(map, markers) {
  for (var i = markers.length - 1; i >= 0; i--) {
    let x = new google.maps.Marker({
      position: new google.maps.LatLng(markers[i].latitude,markers[i].longitude),
      animation: google.maps.Animation.BOUNCE,
      title: markers[i].name,
      label: markers[i].name
    });
    x.setMap(map);
    google.maps.event.addListener(x,'click',()=> {
      var infowindow = new google.maps.InfoWindow({
        content: x.title
      });
      infowindow.open(map , x);
    });
  }
}

function isLogged() {
  var logoutItem = document.getElementById("logoutItem");
  var signItem = document.getElementById("signItem");
  if (localStorage.getItem('token')) {
      logoutItem.setAttribute("style", "display: flex");
      signItem.setAttribute("style", "display: none");
  } else {
    signItem.setAttribute("style", "display: flex");
    logoutItem.setAttribute("style", "display: none");
  }
}

request.get('https://ostlerapi.herokuapp.com/api/garages').promise()
.then( (data)=> {
  return data.body
})
.then( (data)=>{
  var select = document.getElementById("select");
  if (select) {
    for (var i = data.length - 1; i >= 0; i--) {
      var node = document.createElement("option");
      var t = document.createTextNode(data[i].name);
      node.setAttribute("value", data[i]._id);
      node.appendChild(t)
      select.appendChild(node)
    }
  }
})


$(()=>{
  var userDisplayName = document.getElementById('username');
  if ( localStorage.getItem('displayName')) {
    var t = document.createTextNode(localStorage.getItem('displayName'));
    userDisplayName.appendChild(t);
  }

  var submitButton = document.getElementById('submitBook');
  isLogged();
  if (submitButton) {
    submitButton.onclick = ()=> {
      var date = document.getElementById('time').value;
      var garage = document.getElementById('select').value;
      const today =  timestamp('YYYY-MM-DD');
      var jsDate = new Date(today+' '+date+':00');
      var bookingTimestampUTC = Date.parse(jsDate);
      var bookingTimestampCairo = bookingTimestampUTC + 7200000 ;
      var bookingObject = {
        "expectedArrivalTime": bookingTimestampCairo,
        "userId": localStorage.getItem('userId'),
        "garageId": garage
      }
      request.post('https://ostlerapi.herokuapp.com/api/bookings')
      .send(bookingObject)
      .set('Authorization', localStorage.getItem('token'))
      .then( (data)=> {
        alert('You have booked a visit at expected arrival time ' + data.body.expectedArrivalTime);
        window.location.pathname = '/';
      }, (error)=> {
        if (error.res.body.message == "Token is null") {
          alert('You have to login to Book');
          window.location.pathname = './login';
        } else {
          alert(error.res.body.message);
        }
      })
    }
  }

  var logoutButton = document.getElementById('logoutBtn');
  if (logoutButton) {
    logoutButton.onclick = ()=> {
      localStorage.removeItem('token');
      window.location.pathname = './login';
    }
  }

  var loginButton = document.getElementById('loginBtn');
  if (loginButton) {
    loginButton.onclick = ()=> {
      var username = document.getElementById('loginUsername').value;
      var password = document.getElementById('loginPassword').value;
      var user = {
        "username" : username,
        "password" : password
      }
      request.post('https://ostlerapi.herokuapp.com/api/login')
      .send(user)
      .then( (data)=> {
        localStorage.setItem('userId', data.body._id );
        localStorage.setItem('token', data.body.token );
        localStorage.setItem('displayName', data.displayName );

        localStorage.setItem('displayName', data.body.displayName );
        alert('Welcome back, '+data.body.displayName);
        window.location.pathname = '/map';
      }, (error)=>{
        alert(error.res.body.message);
      })
    }
  }

  var signupButton = document.getElementById('signupBtn');
  if (signupButton) {
    signupButton.onclick = ()=> {
      var username = document.getElementById('signupUsername').value;
      var password = document.getElementById('signupPassword').value;
      var displayName = document.getElementById('signupDisplayName').value;
      var phoneNumber = document.getElementById('signupPhoneNumber').value;
      var carNumber = document.getElementById('signupCarNumber').value;
      var user = {
        "username" : username,
        "password" : password,
        "displayName" : displayName,
        "phoneNumber" : phoneNumber,
        "carNumber" : carNumber
      }
      request.post('https://ostlerapi.herokuapp.com/api/users')
      .send(user)
      .then( (data)=> {
        return data.body
      }, (error)=>{
        alert(error.res.body.message);
      })
      .then((data)=>{
        localStorage.setItem('userId', data._id );
        localStorage.setItem('token', data.token );
        localStorage.setItem('displayName', data.displayName );

        var user = {
          "username" : data.username ,
          "password" : data.password
        }
        return request.post('https://ostlerapi.herokuapp.com/api/login').send(user)
      })
      .then( (data)=>{
        alert('Welcome, ' + data.body.displayName);
        window.location.pathname = '/map';
      })

    }
  }
  $('.time').clockTimePicker({});
})
