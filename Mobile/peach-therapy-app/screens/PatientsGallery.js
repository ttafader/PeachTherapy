import { Text, TouchableHighlight, SafeAreaView, StyleSheet, Pressable, View, Image, ScrollView, Button, TouchableOpacity } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
//for conditionals
import PatientNavComp from '../components/PatientNavComp';
import ClinicianNavComp from '../components/ClinicianNavComp';
import { getUserDetails } from '../apis/authenticationAPIs'

import { pullAllPatientsData } from '../apis/databaseAPIs';
import AudioComp from '../components/AudioComp';
import ProfileComp from '../components/ProfileComp';
import BackButton from '../components/BackButton';

export default function PatientsGallery({ navigation, props }) {
  const [patients, setPatients] = useState([])
  const [recordings, setRecordings] = useState({})
  const [loading, setLoading] = useState(true)

  //for condiitonals
  const [user, setUser] = useState([]);

  async function loadUserData() {
    const dets = await getUserDetails()
    setPatients(dets['patients'])
    setUser(dets)
  }

  useEffect(() => {

    setLoading(true)
    if (!isUserSignedIn()) navigation.replace("Login")

    loadUserData();
    setLoading(false)
  }, [])



  return (
    <ScrollView>

      <View style={styles.wholePage}>
        <View style={styles.navBar}>
          {console.log('helooooooo', user)}
          {user?.profile?.user_type === 1 && <ClinicianNavComp navigation={navigation} colorBG={'#FFA386'} />}
          {user?.profile?.user_type === 2 && <PatientNavComp navigation={navigation} colorBG={'#FFA386'} />}
        </View>

        <ProfileHeader colorBG={'#FFA386'} />
        <BackButton navigation={navigation} colorBG={'#FFA386'}></BackButton>
        <ScrollView style={styles.pageContainer}>
          {patients.map((pat_id) => (
            <ProfileComp navigation={navigation} patient_id={pat_id} />
          ))}

        </ScrollView>

      </View>
    </ScrollView>
  );
}




const styles = StyleSheet.create({

  wholePage: {
    flex: 1,
  },
  navBar: {
    height: 120,
    backgroundColor: '#24A8AC',
    // // paddingHorizontal: 15,
  },
  icon: {
    width: 25,
    height: 25,
    margin: 20,
    resizeMode: 'contain',

  },
  accountInfo: {
    //flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    padding: 10,
    height: 100,
    // backgroundColor: '#24A8AC',
    // backgroundColor: '#FFA386',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
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
    // alignItems: '',
    // justifyContent: 'space-evenly',
    //backgroundColor: '#c9c9c9',
  },
  navSelect: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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

