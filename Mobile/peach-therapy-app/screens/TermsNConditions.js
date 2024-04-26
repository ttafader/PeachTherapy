import React, { useEffect } from 'react';
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable, ScrollView } from 'react-native';
import { isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
import BackButton from '../components/BackButton';
import ClinicianNavComp from '../components/ClinicianNavComp';
import PatientNavComp from '../components/PatientNavComp';

export default function TermsNConditions({ navigation, props }) {

  useEffect(() => {
    if (!isUserSignedIn()) navigation.replace("Login")
  })

  function buttonClicked() {
    navigation.navigate('Account')
  }


  function goToNotifs() {
    navigation.navigate('Notifications')
  }
  function goToCalendar() {
    navigation.navigate('Calendar')

  }

  return (//all
    <View style={styles.wholePage}>
      <View style={styles.navBar}>
        <SafeAreaView style={styles.container}>
          <View style={styles.navBar}>
            {user?.profile?.user_type === 1 && <ClinicianNavComp navigation={navigation} />}
            {user?.profile?.user_type === 2 && <PatientNavComp navigation={navigation} colorBG={'#24A8AC'} />}
          </View>

        </SafeAreaView>
      </View>
      <ProfileHeader colorBG={'#24A8AC'} />
      <BackButton navigation={navigation} colorBG={'#24A8AC'}></BackButton>

      <View style={styles.pageContainer}>


        <Pressable style={styles.accentButton} onPress={() => buttonClicked()}>
          <Text style={styles.accentButtonText}>Back to Account</Text>
        </Pressable>
        <View style={styles.buttonContainer}>


          <Text style={styles.title}>
            Terms & Conditions
          </Text>
          <ScrollView style={{ borderWidth: 1, borderColor: '#78D6D9', borderRadius: 10, padding: 10, height: '100%', }}>
            <Text style={styles.body}>
              {'\t'}Welcome to Peach Therapy!

              By accessing and using our mobile application and services, you are agreeing to comply with the following terms and conditions. Users must adhere to all applicable laws and regulations and refrain from unauthorized use, reproduction, or distribution of the app's content. We prioritize the security of user data, especially concerning authentication and Firebase database access. Account credentials should be kept confidential, and users are urged to report any unauthorized access promptly.
              Use of Firebase database resources is subject to Firebase's terms of service, and users must adhere to their policies and guidelines. In the event of a security incident, users are encouraged to report it promptly, and we will take appropriate measures to address and mitigate security concerns. These terms may be updated periodically, with users notified of any changes. Continued use of the app constitutes acceptance of the revised terms. If you do not agree with these terms and conditions, please discontinue the use of Peach Therapy.
            </Text>
          </ScrollView>
          <View style={{
            flexDirection: 'row', justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image source={require('../assets/Group.png')}
              style={{ width: 20, height: 20, marginRight: 15, }}
            />
            <Text style={styles.warning}>
              You have agreed to the above terms and Conditions
            </Text>

          </View>



        </View>

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
    backgroundColor: '#24A8AC',
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

  title: {
    color: '#24A8AC',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 40,
    marginBottom: 20,

  },
  body: {
    color: '#24A8AC',
  },
  warning: {
    color: '#24A8AC',
    fontWeight: '700',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
    width: '70%',
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
    letterSpacing: 1,
    // wordWrap: 'break-word',
    textAlign: 'center',
  },



});

