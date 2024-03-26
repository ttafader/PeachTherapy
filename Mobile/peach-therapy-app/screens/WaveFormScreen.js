import React, { useState, useEffect, Component } from 'react';
import { Text, TouchableHighlight, SafeAreaView, StyleSheet, Pressable, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { audiodataarray } from './audioData';
import { Audio } from 'expo-av';
import { getAllDoctorsData, getAllPatientsData } from "../apis/databaseAPIs";
import { getUserDetails, isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
import AudioComp from '../components/AudioComp';


export default function WaveformScreen({ navigation, props }) {
  const [loading, setLoading] = useState(true)
  const [recordings, setRecordings] = useState({})
  // const [normalizedAudio, setNormalizedAudio] = useState([])
  // const [heighestAmp, setHeighestAmp] = useState(0)
  // const [playing, setPlaying] = useState(false)

  // const [doctors, setDoctors] = useState({})
  // const [patients, setPatients] = useState({})
  // const [sound, setSound] = useState();


  useEffect(() => {
    setLoading(true)
    if (!isUserSignedIn()) navigation.replace("Login")
    loadUserData();
    setLoading(false)


    async function loadUserData() {
      const dets = await getUserDetails()
      setRecordings(dets['recordings'][0])

    }
    // const audiofileArray = audiodataarray

    // setNormalizedAudio(resizeAudioData(audiofileArray))
    // setHeighestAmp(Math.max(...audiofileArray))
  }, []);

  function goToSettings() {
    navigation.navigate('Account')
  }
  function goToChart() {
    navigation.navigate('DonutChart')

  }
  function detailsClicked() {
    navigation.navigate('WaveFormDetails')
    //call firebase sign in function and send username password variable as param
  }
  function goToRecordings() {
    navigation.navigate('WaveFormScreen')
    //call firebase sign in function and send username password variable as param
  }
  function goToNotifs() {
    navigation.navigate('Notifications')
  }
  function goToCal() {
    navigation.navigate('Calendar')
  }

  // Define styles for different states for first

  return loading ? (
    <ScrollView>
      <SafeAreaView>
        <SafeAreaView style={{
          //flex: 1,
          height: 80,
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          flexDirection: 'row',
          backgroundColor: '#FFA386',
        }}>
          <ActivityIndicator size={'small'} color={'#FFFFFF'} />
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>) :
    (
      <ScrollView>
        <SafeAreaView>
          <SafeAreaView style={{
            //flex: 1,
            height: 80,
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            flexDirection: 'row',
            backgroundColor: '#FFA386',
          }}>
            <View style={styles.navSelect}>
              <Image source={require('../assets/recordselect.png')} style={styles.icon} />
            </View>

            <Pressable onPress={() => goToChart()}>
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
            <Pressable onPress={() => goToSettings()}>
              <Image source={require('../assets/man.png')}
                style={styles.icon}
              />
            </Pressable>
          </SafeAreaView>

          <ProfileHeader />

          {
            Object.keys(recordings).map((rec_id, idx) =>
              (<AudioComp idx={idx} recording={recordings[rec_id][0]} />)
            )
          }

          {/* <View style={{ justifyContent: "center", display: "flex", flexDirection: "column", flexWrap: "wrap", gap: 10 }}>
            {
                Object.keys(patients).map((patient_id) => {
                    return (
                        <View style={{}} >
                            <Text>First Name: {patients[patient_id].first_name}</Text>
                            <Text>Last Name: {patients[patient_id].last_name}</Text>
                            <Text>Birthdate: {patients[patient_id].birthdate}</Text>
                            <Text>Patient ID: {patients[patient_id].patient_id}</Text>
                            <Text>Doctor ID: {patients[patient_id].doctor_id}</Text>
                            <Text>Age: {patients[patient_id].age}</Text>
                            <Text>Health Card Number: {patients[patient_id].health_card_number}</Text>
                            <Text>Gender: {patients[patient_id].gender}</Text>
                        </View>
                    )
                })
            }
        </View > */}
        </SafeAreaView>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  singleRecording: {
    padding: 30,
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FEE7DD',
    borderRadius: 10,
    borderColor: '#F1C4B6',
    borderWidth: 2,

  },
  text: {
    color: '#2EAAAE',
    fontWeight: '700',

  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
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
    backgroundColor: '#FFA386',
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
    paddingHorizontal: 15,
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