import React, { Component, useEffect, useState } from 'react';
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable } from 'react-native';
import { isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from './ProfileHeader';

export default function ClinicianNavComp({ navigation, colorBG }) {
  const [user, setUser] = useState({});
  const [patient, setDoc] = useState({})

  useEffect(() => {
    if (!isUserSignedIn()) navigation.replace("Login");
    console.log('askjdghaskjdha')
    loadUserData()
  }, [])

  async function loadUserData() {
    const doc = await getUserDetails()
    setDoc(doc)
  }

  function goToAccount() {
    navigation.navigate('Account')
  }
  function goToNotifs() {
    navigation.navigate('Notifications')
  }

  function goToCal() {
    navigation.navigate('PatientsGallery', {
      mode: "doctor",
      patientObject: -99
    })
  }



  return (//all
    <View style={styles.wholePage}>
      <View style={[styles.navBar, { backgroundColor: colorBG }]}>
        <SafeAreaView style={styles.container}>
          <Pressable onPress={() => goToCal()}>
            <Image source={require('../assets/patientswhite.png')}
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={() => goToNotifs()}>
            <Image source={require('../assets/Vector-2.png')}
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={() => goToAccount()}>
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
    // backgroundColor: '#24A8AC',
    // paddingHorizontal: 15,
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

    fontSize: 18,
    //fontStyle: normal,
    fontWeight: '700',
    lineHeight: 18.5, /* 123.333% */
    letterSpacing: 0.5,
  },
  profileSubheading: {
    color: 'white',
    //fontFamily: '',

    //fontFamily: "Montserrat",
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

    //fontFamily: "Montserrat",
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

