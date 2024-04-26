import React, { Component, useEffect, useState } from 'react';
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable, ScrollView } from 'react-native';
import { isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
//for conditionals
import PatientNavComp from '../components/PatientNavComp';
import ClinicianNavComp from '../components/ClinicianNavComp';
import { getUserDetails } from '../apis/authenticationAPIs'
import BackButton from '../components/BackButton';

export default function Notifications({ navigation, props }) {
  //for condiitonals
  const [user, setUser] = useState({});
  useEffect(() => {

    if (!isUserSignedIn()) navigation.replace("Login");
    async function loadUserData() {
      setUser(await getUserDetails())
    }
    loadUserData()
  }, [])

  useEffect(() => {
    if (!isUserSignedIn()) navigation.replace("Login")
  })
  function buttonClicked() {
    navigation.navigate('Account')

  }
  function goToCalendar() {
    navigation.navigate('Calendar')

  }
  function goToChart() {
    navigation.navigate('Chart')

  }

  return (//all
    <ScrollView style={styles.wholePage}>
      <View style={styles.navBar}>

        {user?.profile?.user_type === 1 && <ClinicianNavComp navigation={navigation} colorBG={'#FFA386'} />}
        {user?.profile?.user_type === 2 && <PatientNavComp navigation={navigation} colorBG={'#FFA386'} />}

      </View>
      <ProfileHeader colorBG={'#FFA386'} />

      <BackButton navigation={navigation} colorBG={'#FFA386'}></BackButton>
      <View style={styles.pageContainer}>

        <Text style={styles.title}>
          Your Notifications
        </Text>
        {/* 
        <View style={styles.newNotif} >
          <Text style={styles.accentButtonText}>New</Text>
          <View style={{ backgroundColor: '#FFFAF9', borderColor: '#F08462', borderWidth: 2, padding: 20, borderRadius: 10, textAlign: 'left', }}>
            <Text style={{
              color: '#F08462',
              fontSize: 18,
              fontWeight: '700',
              lineHeight: 20,
              letterSpacing: 1,
              // wordWrap: 'break-word',
              textAlign: 'left',
            }}>Dr. Tajmina Tafader</Text>
            <Image source={require('../assets/peachnotif.png')}
              style={{
                position: 'absolute',
                top: -50,
                left: '80%'

              }}
            />
            <Text style={{
              color: '#78D6D9',
              fontSize: 13,
              fontWeight: '500',
              lineHeight: 20,
              letterSpacing: 1,
              // wordWrap: 'break-word',
              textAlign: 'left',
              marginBottom: 10,
            }}>@ 4:30 09/10/23</Text>
            <Text style={{
              color: '#F08462',
              fontSize: 16,
              fontWeight: '400',
              lineHeight: 20,
              letterSpacing: 1,
              // wordWrap: 'break-word',
              textAlign: 'left',

            }}>has updated your recording #0789 with Doctor’s Notes</Text>
          </View>
        </View> */}

        {/* 

        <View style={styles.oldNotif} >
          <Text style={styles.accentButtonText}>Previous Notifications</Text>

          <View style={{ backgroundColor: '#FFFAF9', borderColor: '#F08462', borderWidth: 1, padding: 20, borderRadius: 10, textAlign: 'left', marginBottom: 20, width: "100%" }}>

            <View>
              <Text style={{
                color: '#F08462',
                fontSize: 18,
                fontWeight: '700',
                lineHeight: 20,
                letterSpacing: 1,
                // wordWrap: 'break-word',
                textAlign: 'left',
              }}>Dr. Tajmina Tafader</Text>
              <Text style={{
                color: '#78D6D9',
                fontSize: 13,
                fontWeight: '500',
                lineHeight: 20,
                letterSpacing: 1,
                // wordWrap: 'break-word',
                textAlign: 'left',
                marginBottom: 10,
              }}>@ 4:30 09/10/23</Text>
            </View>


            <Text style={{
              color: '#F08462',
              fontSize: 16,
              fontWeight: '400',
              lineHeight: 20,
              letterSpacing: 1,
              // wordWrap: 'break-word',
              textAlign: 'left',

            }}>Canceled the upcoming appointment on Dec 19th.</Text>
          </View>
          <View style={{ backgroundColor: '#FFFAF9', borderColor: '#FFA386', borderWidth: 1, padding: 20, borderRadius: 10, textAlign: 'left', marginBottom: 20, width: '100%' }}>

            <View>
              <Text style={{
                color: '#F08462',
                fontSize: 18,
                fontWeight: '700',
                lineHeight: 20,
                letterSpacing: 1,
                // wordWrap: 'break-word',
                textAlign: 'left',
              }}>Dr. Shanzeh Qureshi</Text>
              <Text style={{
                color: '#78D6D9',
                fontSize: 13,
                fontWeight: '500',
                lineHeight: 20,
                letterSpacing: 1,
                // wordWrap: 'break-word',
                textAlign: 'left',
                marginBottom: 10,
              }}>@ 4:30 09/10/23</Text>
            </View>


            <Text style={{
              color: '#F08462',
              fontSize: 16,
              fontWeight: '400',
              lineHeight: 20,
              letterSpacing: 1,
              // wordWrap: 'break-word',
              textAlign: 'left',
            }}>Has transferred you to Dr. Tajmina Tafader.</Text>
          </View>
          <View style={{ backgroundColor: '#FFFAF9', borderColor: '#F08462', borderWidth: 1, padding: 20, borderRadius: 10, textAlign: 'left', width: '100%' }}>

            <View>
              <Text style={{
                color: '#F08462',
                fontSize: 18,
                fontWeight: '700',
                lineHeight: 20,
                letterSpacing: 1,
                // wordWrap: 'break-word',
                textAlign: 'left',
              }}>You</Text>
              <Text style={{
                color: '#78D6D9',
                fontSize: 13,
                fontWeight: '500',
                lineHeight: 20,
                letterSpacing: 1,
                // wordWrap: 'break-word',
                textAlign: 'left',
                marginBottom: 10,
              }}>@ 4:30 09/10/23</Text>
            </View>


            <Text style={{
              color: '#F08462',
              fontSize: 16,
              fontWeight: '400',
              lineHeight: 20,
              letterSpacing: 1,
              // wordWrap: 'break-word',
              textAlign: 'left',
            }}>Created your Account on Oct 21st ,2022</Text>
          </View>

        </View> */}

        <Text style={styles.accentButtonText}>You have {'\n'}no new notifications</Text>


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
    backgroundColor: '#FFA386',
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
    marginVertical: 50,
    height: 'center',
    alignItems: 'center',
    justifyContent: '',
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
    backgroundColor: '#FFA386',
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
    justifyContent: 'center',
    // backgroundColor:'black',

    //elevation: 3,

  },

  title: {
    color: '#24A8AC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: 1,
    textAlign: 'center',

  },
  body: {
    color: '#FFA386',
  },
  warning: {
    color: '#FFA386',
    fontWeight: '700',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
    width: '70%',
  },

  newNotif: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: '50%',
    width: '100%',
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderColor: '#FFBCA7',
    paddingHorizontal: 30,
    paddingVertical: 50,


  },
  oldNotif: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: '50%',
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 50,


  },
  accentButtonText: {
    // Login
    color: '#F08462',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
    // wordWrap: 'break-word',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 30,

  },



});

