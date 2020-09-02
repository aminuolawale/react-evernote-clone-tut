import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const firebase = require("firebase");
require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9cvLU0KD_dR1EZHejsW3XzIEn_nwfaf4",
  authDomain: "evernoteclone-8aeb3.firebaseapp.com",
  databaseURL: "https://evernoteclone-8aeb3.firebaseio.com",
  projectId: "evernoteclone-8aeb3",
  storageBucket: "evernoteclone-8aeb3.appspot.com",
  messagingSenderId: "211389756293",
  appId: "1:211389756293:web:26d76014f467606ef30aec",
  measurementId: "G-QP2T2EW31N"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <App />,
  document.getElementById('evernote-container')
);
