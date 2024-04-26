import React, { Component, useEffect, useState } from 'react';
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable, ScrollView, RefreshControl } from 'react-native';
import { isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
//for conditionals
import PatientNavComp from '../components/PatientNavComp';
import ClinicianNavComp from '../components/ClinicianNavComp';
import { getUserDetails } from '../apis/authenticationAPIs'
import BackButton from '../components/BackButton';
import CalendarComp from '../components/CalendarComp';
import { getPerson, getMyAppointments } from '../utilities/database_functions'
import ClinicianHeader from '../components/ClinicianHeader';

export default function Calendar({ navigation, route }) {

  const { mode, patientObject } = route.params

  //for condiitonals
  const [user, setUser] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // for appointments
  const [appointments, setAppointments] = useState([]);

  // NAZU - EXAMPLE OF SORTING
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
      setAppointments(patientObject.appointments)
    }
    loadUserData();
  }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     // console.log(mode)
  //     const myAppointments = []
  //     if (mode === 'patient') {
  //       myAppointments = await getMyAppointments(patientObject.profile.patient_id);
  //     } else if (mode === 'doctor') {
  //       myAppointments = await getMyAppointments(user.appointments.doctor_id)
  //     }

  //     console.log('heyy---------------------')
  //     const sortedAppts = myAppointments.sort(function (a, b) {
  //       return new Date(b.date_time) - new Date(a.date_time);
  //     });

  //     setAppointments(sortedAppts);
  //   }

  //   fetchData();
  // }, []);

  useEffect(() => {
    async function fetchData() {
      let myAppointments = []; // Changed from `const` to `let`

      // Ensure variables `mode`, `patientObject`, and `user` are defined
      if (mode === 'patient') {
        myAppointments = await getMyAppointments(patientObject.profile.patient_id);
      } else if (mode === 'doctor') {
        myAppointments = await getMyAppointments(patientObject.appointments.doctor_id);
      }

      console.log('heyy---------------------');
      const sortedAppts = myAppointments.sort(function (a, b) {
        return new Date(b.date_time) - new Date(a.date_time);
      });

      setAppointments(sortedAppts);
    }

    fetchData();
  }, []); // Dependencies array is empty, indicating this effect runs once on mount.


  const handleRefresh = async () => {
    console.log('Refreshing...');
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
    console.log('Refreshed!');
  }

  useEffect(() => {
    return () => {
      setRefreshing(false); // Reset refreshing state on unmount
    };
  }, []);

  return (//all
    <ScrollView style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#0000ff']}
        />
      }
    >
      <View style={styles.navBar}>

        {user?.profile?.user_type === 1 && <ClinicianNavComp navigation={navigation} colorBG={'#FFA386'} />}
        {user?.profile?.user_type === 2 && <PatientNavComp navigation={navigation} colorBG={'#FFA386'} />}

      </View>

      <ProfileHeader colorBG={'#FFA386'} />
      {user?.profile?.user_type === 1 && <ClinicianHeader colorBG={'#24A8AC'} patientObject={patientObject} />}

      <BackButton navigation={navigation} colorBG={'#FFA386'}></BackButton>
      <View style={styles.pageContainer}>

        <Text style={styles.title}>
          Your Upcoming Appointments
        </Text>

        {appointments && Object.keys(appointments).length > 0 ?
          Object.keys(appointments).map((apt_id, idx) =>
            (<CalendarComp idx={idx} refreshControl appointments={appointments[apt_id]} />)
          ) : (
            <Text style={styles.noRecordings}>No appointments{'\n'}available at this time</Text>
          )}
        {/* <CalendarComp></CalendarComp> */}


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
  wholePage: {
    flex: 1,
  },
  navBar: {
    height: 120,
    backgroundColor: '#FFA386',
    // // paddingHorizontal: 15,
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

