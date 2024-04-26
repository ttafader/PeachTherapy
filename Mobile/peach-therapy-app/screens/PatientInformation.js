import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { getAllDoctorsData, getAllPatientsData } from "../apis/databaseAPIs";
import { getUserDetails, isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
import AudioComp from '../components/AudioComp';
import PatientNavComp from '../components/PatientNavComp';
import ClinicianNavComp from '../components/ClinicianNavComp';
import BackButton from '../components/BackButton';
import { getPerson } from '../utilities/database_functions';
import ClinicianHeader from '../components/ClinicianHeader';

export default function PatientInformation({ navigation, route }) {
  const { patientObject } = route.params
  const customLabels = {
    birthday: "Birthday",
    doctor_id: "Doctor ID",
    doctor_name: "Doctor Name",
    email: "Email",
    first_name: "First Name",
    img_url: "Image URL",
    last_name: "Last Name",
    ml_boundaries_plot: "ML Boundaries Plot",
    patient_id: "Patient ID",
    sex: "Sex",
    user_type: "User Type"
  };
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [recordings, setRecordings] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      setUser(await getUserDetails());
      setLoading(false);
    }
    loadUserData();
  }, []);

  useEffect(() => {
    if (!isUserSignedIn()) navigation.replace("Login");

    async function loadUserData() {
      setRecordings(patientObject.profile)
    }
    loadUserData();
  }, []);


  return loading ? (
    <ScrollView>
      <SafeAreaView>
        <SafeAreaView style={{
          height: 80,
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          flexDirection: 'row',
          backgroundColor: '#FFA386',
        }}>
          <ActivityIndicator size={'small'} color={'#FFFFFF'} />
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  ) : (
    <ScrollView style={styles.wholePage}>
      <View style={styles.navBar}>
        {user?.profile?.user_type === 1 && <ClinicianNavComp navigation={navigation} colorBG={'#FFA386'} />}
        {user?.profile?.user_type === 2 && <PatientNavComp navigation={navigation} colorBG={'#FFA386'} />}
      </View>
      <ProfileHeader colorBG={'#FFA386'} />
      {user?.profile?.user_type === 1 && <ClinicianHeader colorBG={'#24A8AC'} patientObject={patientObject} />}

      <BackButton colorBG={'#FFA386'} navigation={navigation}></BackButton>
      <View style={{ width: "100%", padding: 40 }}>
        <Text style={styles.title}>{patientObject.profile.first_name}'s Patient Information</Text>
        {Object.keys(patientObject.profile).map((key, index) => (
          // Check if the key is not equal to 'ml_boundaries_plot' before rendering
          key !== 'ml_boundaries_plot' && key !== 'user_type' && (
            <View key={index} >
              <Text style={styles.text}>{customLabels[key]}:{'\n'}{patientObject.profile[key]}{'\n'}</Text>
            </View>
          )
        ))}

      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  noRecordings: {
    fontWeight: "700",
    color: '#FFA386',
    fontSize: 16,
    textAlign: 'center',
  },

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
    fontWeight: '500',
    textAlign: 'center',

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
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    flexDirection: 'row',
    // backgroundColor: '#FFA386',
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
    // paddingHorizontal: 15,
  },
  icon: {
    width: 25,
    height: 25,
    margin: 20,
    resizeMode: 'contain',

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

  buttonContainer: {

    height: '60%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'black',

    //elevation: 3,

  },

  title: {
    // color: '#78D6D9',
    color: '#2EAAAE',
    fontSize: 20,
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