// Initialize Firebase
var config = {
  apiKey: "AIzaSyADm1pGfwlso3rwWipDY2h1cWqGMyF-pcg",
  authDomain: "biospecmlc2019-registration.firebaseapp.com",
  databaseURL: "https://biospecmlc2019-registration.firebaseio.com",
  projectId: "biospecmlc2019-registration",
  storageBucket: "biospecmlc2019-registration.appspot.com",
  messagingSenderId: "278961283165"
};
firebase.initializeApp(config);
var firestore = firebase.firestore();