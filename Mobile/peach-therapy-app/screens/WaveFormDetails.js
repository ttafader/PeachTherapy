import React, { useState, useEffect, Component } from 'react';
import { Text, TouchableHighlight, SafeAreaView, StyleSheet, Pressable, View, Image, ScrollView } from 'react-native';
import { audiodataarray } from './waste/audioData';
import { isUserSignedIn } from '../apis/authenticationAPIs';

//for condiitonals
import { getUserDetails } from '../apis/authenticationAPIs'
import PatientNavComp from '../components/PatientNavComp';
import ClinicianNavComp from '../components/ClinicianNavComp';
import BackButton from '../components/BackButton';

export default function WaveFormDetails({ navigation, props }) {
  const [normalizedAudio, setNormalizedAudio] = useState([])
  const [heighestAmp, setHeighestAmp] = useState(0)
  const [playing, setPlaying] = useState(false)

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

  function goToSettings() {
    navigation.navigate('Settings')
  }
  function goToCalendar() {
    navigation.navigate('Calendar')

  }
  function goToChart() {
    navigation.navigate('Chart')

  }
  function goToNotifs() {
    navigation.navigate('Notifications')
  }

  function resizeAudioData(originalArray) {
    const originalSize = originalArray.length
    console.log(originalSize)
    const newSize = 35
    const ratio = originalSize / newSize
    const newArray = []

    for (let i = 0; i < newSize; i++) {
      const newIndex = Math.floor(i * ratio);
      console.log(originalArray[newIndex])
      newArray.push(originalArray[newIndex] + 0.02)
      // console.log(i, Math.floor(i*ratio), originalArray[newIndex])
    }

    return newArray;
  }

  useEffect(() => {
    const audiofileArray = audiodataarray

    setNormalizedAudio(resizeAudioData(audiofileArray))
    setHeighestAmp(Math.max(...audiofileArray))
  }, []);

  function turnAudioLineIntoPercentForCSS(value) {
    const percent = (value / heighestAmp) * 100
    return percent + '%'
  }

  return (
    <ScrollView>
      {/* for conditionals */}
      {user?.profile?.user_type === 1 && <ClinicianNavComp navigation={navigation} colorBG={'#FFA386'} />}
      {user?.profile?.user_type === 2 && <PatientNavComp navigation={navigation} colorBG={'#FFA386'} />}

      <BackButton navigation={navigation} colorBG={'#FFA386'}></BackButton>
      <SafeAreaView>


        <Pressable style={[styles.singleRecording]} >
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 80, color: 'white', opacity: 0.6, fontWeight: '500', marginTop: 10, }}>
              01
            </Text>
            <View style={{ justifyContent: 'center', padding: 25 }}>
              <Text style={{ color: 'white', fontSize: 30, fontWeight: '700', }}>
                11-11-2023
              </Text>
              <Text style={{ color: 'white', fontWeight: '500', maxWidth: 200, }}>
                Phrase: "When the rain drops"
              </Text>
            </View>
          </View>

          <View>
            <View style={styles.waveformContainer}>
              {normalizedAudio.map(audioLine => (
                <View style={{ ...styles.waveformLine, height: turnAudioLineIntoPercentForCSS(audioLine), }} />
              ))}
            </View>
          </View>


          <Pressable style={[styles.button]} >
            <View style={{
              height: 15,
              width: '100%',
              backgroundColor: 'white',
              marginBottom: 30,
              borderRadius: 10,
              padding: 3,
              borderWidth: 1,
              borderColor: "#FFAC91"

            }}>

              <View style={{
                height: '100%',
                width: '90%',
                backgroundColor: '#BBF1A1',
                borderRadius: 8,

              }}>

              </View>
            </View>
            <Text style={{ color: "#FFAC91", fontWeight: '700', textAlign: 'left' }}>Doctor’s Notes</Text>
            <Text style={{ color: "#FFAC91" }}>View More Details</Text>
            <Text style={{ color: "#FFAC91" }}>"When the raindrops...":
              {'\n'}Target Sounds: The patient demonstrated minimal difficulty with this word. The target sounds, in this case, would be the sounds in "turkey" that the patient produced correctly. The speech pathologist may use these sounds as a baseline for therapy.</Text>
          </Pressable>

        </Pressable>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  singleRecording: {
    padding: 30,
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFAC91',
    borderRadius: 10,
    borderColor: '#F1C4B6',
    borderWidth: 2,

  },
  text: {
    color: '#2EAAAE',
    fontWeight: '700',

  },
  button: {

    padding: 30,
    elevation: 3,
    //width: '50%',

    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 8,
    alignItems: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  waveformContainer: {

    marginLeft: 1,
    //width: "100%",
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,

  },
  waveformLine: {
    borderRadius: 9999,
    //marginRight: '1%',
    width: '2%',
    backgroundColor: 'white',
  },

  wholePage: {
    flex: 1,
  },
  bigPercent: {
    // position: 'absolute',
    fontSize: 100,
    fontWeight: '700',
    color: '#FFA386',
    alignItems: 'center',
    justifyContent: 'center',
    //left: '30%',
    //top: '30%',
    position: 'absolute',
    zIndex: 2,
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
    //alignItems: 'flex-end',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: '#FFA386',
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
    fontSize: 18,
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
    color: '#78D6D9',
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
    borderColor: '#FDF1E4',
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
    color: '#FFD0BA',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
    // wordWrap: 'break-word',
    textAlign: 'left',
    marginBottom: 40,
    opacity: '40%',

  },



});