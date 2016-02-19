function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();

	// var id_token = googleUser.getAuthResponse().id_token;

	// var xhr = new XMLHttpRequest();
	// xhr.open('POST', 'https://ghost.projectcodex.co/3007');
	// xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	// xhr.onload = function() {
	//   console.log('Signed in as: ' + xhr.responseText);
	// };

	// xhr.send({id_token : id_token});

	var user = {
		fullname : profile.getName(),
		email : profile.getEmail()
	};

	console.log("user : ", user);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
};