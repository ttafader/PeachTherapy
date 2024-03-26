import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, SafeAreaView } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationContainer } from '@react-navigation/native';
import { MyStack } from "./navigation/MainStackNavigator";
//import firebase from '@react-native-firebase/app';


/*
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'YOUR_DATABASE_URL',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
*/

export default function App() {
  return (
    <NavigationContainer>
      {/* <StatusBar barStyle="dark-content" backgroundColor="white" /> */}
      <MyStack />
    </NavigationContainer>
  );
}
//export default firebase;
