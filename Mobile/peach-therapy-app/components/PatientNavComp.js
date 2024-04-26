import React, { Component, useEffect, useState } from 'react';
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable } from 'react-native';
import { getUserDetails, isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from './ProfileHeader';

export default function PatientNavComp({ navigation, colorBG }) {

  const [patient, setPatient] = useState({})

  useEffect(() => {
    if (!isUserSignedIn()) navigation.replace("Login");

    loadUserData()
  }, [])

  async function loadUserData() {
    const pat = await getUserDetails()
    setPatient(pat)
  }

  function buttonClicked() {
    navigation.navigate('Account')
  }
  function goToRecordings() {
    navigation.navigate('Waveform', {
      patientObject: patient
    })
  }
  function goToNotifs() {
    navigation.navigate('Notifications')
  }
  function goToCharts() {
    navigation.navigate('Chart', {
      patientObject: patient
    })
  }
  function goToCal() {
    navigation.navigate('Calendar', {
      mode: "patient",
      patientObject: patient
    })
  }


  return (//all
    <View style={styles.wholePage}>
      <View style={[styles.navBar, { backgroundColor: colorBG }]}>
        <SafeAreaView style={styles.container}>
          <Pressable onPress={() => goToRecordings()}>
            <Image source={require('../assets/Vector-4.png')}
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={() => goToCharts()}>
            <Image source={require('../assets/Vector.png')}
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={() => goToCal()}>
            <Image source={require('../assets/Vector-1.png')}
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={() => goToNotifs()}>
            <Image source={require('../assets/Vector-2.png')}
              style={styles.icon}
            />
          </Pressable>
          {/* style={styles.navSelect} */}
          <Pressable onPress={() => buttonClicked()}>
            <Image source={require('../assets/man.png')} style={styles.icon} />
          </Pressable>
        </SafeAreaView>
      </View>

    </View>
  );
}




const styles = StyleSheet.create({

  wholePage: {
    flex: 1,
  },
  navBar: {
    height: 120,
    // backgroundColor: colorBG,
    paddingHorizontal: 20,
  },
  icon: {
    width: 25,
    height: 25,
    margin: 20,
    resizeMode: 'contain',

  },
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  pageContainer: {
    flex: 1,
    margin: 50,
    height: '',
    alignItems: '',
    justifyContent: 'space-evenly',
    //backgroundColor: '#c9c9c9',
  },
  navSelect: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  accountInfo: {
    //flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    padding: 10,
    height: 100,
    backgroundColor: '#24A8AC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfoContainer: {
    margin: 10,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  profileDescription: {
    color: 'white',
    //font-family: Montserrat,
    fontSize: 18,
    //fontStyle: normal,
    fontWeight: '700',
    lineHeight: 18.5, /* 123.333% */
    letterSpacing: 0.5,
  },
  profileSubheading: {
    color: 'white',
    //fontFamily: '',
    fontSize: 14,
    //fontStyle: normal,
    fontWeight: '300',
    lineHeight: 15, /* 123.333% */
    letterSpacing: 0,
    // wordWrap: 'break-word',
  },
  buttonContainer: {

    height: '60%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // backgroundColor:'black',

    //elevation: 3,

  },
  button: {

    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 20,
    //elevation: 3,


    backgroundColor: '#EDFDFF',
    borderRadius: 10,
    borderColor: '#24A8AC',
    borderWidth: 2,

  },

  text: {
    // Login
    color: '#24A8AC',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,

    // wordWrap: 'break-word',
  },

  accentButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
    paddingHorizontal: 32,
    width: '100%',

    backgroundColor: '#78D6D9',
    borderRadius: 10,
  },
  accentButtonText: {
    // Login
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
    // wordWrap: 'break-word',
    textAlign: 'center',
  },



});

