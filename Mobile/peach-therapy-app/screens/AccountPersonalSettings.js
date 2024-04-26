import React, { useState, Component, useEffect } from 'react';
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable, ScrollView, Switch, RefreshControl } from 'react-native';
import DropdownComponent from './waste/DropdownComponent';
import { isUserSignedIn, logout } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
//for conditionals
import PatientNavComp from '../components/PatientNavComp';
import ClinicianNavComp from '../components/ClinicianNavComp';
import { getUserDetails } from '../apis/authenticationAPIs'
import BackButton from '../components/BackButton';
export default function AccountPersonalSettings({ navigation, props }) {
  //for condiitonals
  const [user, setUser] = useState({});

  useEffect(() => {
    if (!isUserSignedIn()) {
      navigation.replace('Login');
    } else {
      loadUserData();
    }
  }, []);

  useEffect(() => {
    if (!isUserSignedIn()) {
      navigation.replace('Login');
    }
  }, [user]); // Add 'user' as a dependency

  const loadUserData = async () => {
    setUser(await getUserDetails());
  };

  function buttonClicked() {
    navigation.navigate('Account')

  }

  async function logoutButtonClicked() {
    await logout()
    navigation.navigate('Login')

  }

  function goToNotifs() {
    navigation.navigate('Notifications')
  }
  function goToCalendar() {
    navigation.navigate('Calendar')

  }
  const [isEnabledNotif, setIsEnabledNotif] = useState(false);
  const toggleSwitchNotif = () => setIsEnabledNotif(previousState => !previousState);
  const [isEnabledMic, setIsEnabledMic] = useState(false);
  const toggleSwitchMic = () => setIsEnabledMic(previousState => !previousState);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isEnabledtext, setIsEnabledtext] = useState(false);
  const toggleSwitchtext = () => setIsEnabledtext(previousState => !previousState);
  // const [isEnabled, setIsEnabled] = useState(false);
  //const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  //const [isEnabled, setIsEnabled] = useState(false);
  //const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [refreshing, setRefreshing] = useState(false);
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
    <ScrollView style={styles.wholePage} refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        colors={['#0000ff']}
      />
    }
    >
      <View style={styles.navBar}>

        {user?.profile?.user_type === 1 && <ClinicianNavComp navigation={navigation} />}
        {user?.profile?.user_type === 2 && <PatientNavComp navigation={navigation} colorBG={'#24A8AC'} />}


      </View>

      <ProfileHeader colorBG={'#24A8AC'} />
      <BackButton navigation={navigation} colorBG={'#24A8AC'} ></BackButton>
      <View style={styles.pageContainer}>
        <Pressable style={styles.accentButton} onPress={() => buttonClicked()}>
          <Text style={styles.accentButtonText}>Back to Account</Text>
        </Pressable>
        {/* <Pressable style={styles.accentButtonLogout} onPress={() => logoutButtonClicked()}>
          <Text style={styles.accentButtonText}>Logout</Text>
        </Pressable> */}
        <View style={styles.buttonContainer}>
        </View>
      </View>


      <View style={{ borderBottomWidth: 1, borderColor: '#24A8AC', flexDirection: 'row', }}>
        <View style={{ width: '60%', height: 150, justifyContent: 'center', marginLeft: 20, }}>
          <Text style={styles.title}>
            Reports
          </Text>
          <Text style={styles.body}>
            Send Crash Reports Automatically.
          </Text>
        </View>

        <View style={styles.containerSwitch}>
          <Switch
            trackColor={{ false: '#24A8AC', true: '#FFA386' }}
            thumbColor={isEnabledNotif ? 'white' : 'white'}
            ios_backgroundColor="#24A8AC"
            onValueChange={toggleSwitchNotif}
            value={isEnabledNotif}
          />
        </View>
      </View>
      <View style={{ borderBottomWidth: 1, borderColor: '#24A8AC', flexDirection: 'row', }}>
        <View style={{ width: '60%', height: 150, justifyContent: 'center', marginLeft: 20, }}>
          <Text style={styles.title}>
            Access Offline
          </Text>
          <Text style={styles.body}>
            Would you like to acces voice files offline?
          </Text>
        </View>

        <View style={styles.containerSwitch}>
          <Switch
            trackColor={{ false: '#24A8AC', true: '#FFA386' }}
            thumbColor={isEnabledMic ? 'white' : 'white'}
            ios_backgroundColor="#24A8AC"
            onValueChange={toggleSwitchMic}
            value={isEnabledMic}
          />
        </View>
      </View>
      {/* <View style={{ borderBottomWidth: 1, borderColor: '#24A8AC', flexDirection: 'row', }}>
        <View style={{ width: '60%', height: 150, justifyContent: 'center', marginLeft: 20, }}>
          <Text style={styles.title}>
            App Apperance
          </Text>
          <Text style={styles.body}>
            Enable dark mode.
          </Text>
        </View>

        <View style={styles.containerSwitch}>
          <Switch
            trackColor={{ false: '#24A8AC', true: '#FFA386' }}
            thumbColor={isEnabled ? 'white' : 'white'}
            ios_backgroundColor="#24A8AC"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View> */}


      <View style={{ borderBottomWidth: 1, marginBottom: 200, borderColor: '#24A8AC', flexDirection: 'column', paddingBottom: 20, paddingHorizontal: 20, justifyContent: 'space-around' }}>
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.title}>
            Notifications
          </Text>
          <Text style={styles.body}>
            Would you like to receive text, email or notifications as you enter the app for appointments, account changes and in-app messages from the Clinician?
          </Text>
        </View>
        <DropdownComponent style={{ margin: 40 }} />

      </View>
      {/* <View style={{ borderBottomWidth: 1, borderColor: '#24A8AC', flexDirection: 'row', }}>
        <View style={{ width: '60%', height: 150, justifyContent: 'center', marginLeft: 20, }}>
          <Text style={styles.title}>
            Email Notifications
          </Text>
          <Text style={styles.body}>
            Would you like to receive email notifications for appointments, account changes and in-app messages from the Clinician?
          </Text>
        </View>

        <View style={styles.containerSwitch}>
          <Switch
            trackColor={{ false: '#24A8AC', true: '#FFA386' }}
            thumbColor={isEnabled ? 'white' : 'white'}
            ios_backgroundColor="#24A8AC"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View> */}
      {/* <View style={{ borderBottomWidth: 1, borderColor: '#24A8AC', flexDirection: 'row', }}>
        <View style={{ width: '60%', height: 150, justifyContent: 'center', marginLeft: 20, }}>
          <Text style={styles.title}>
            Secure Messaging
          </Text>
          <Text style={styles.body}>
            Push Notifications
          </Text>
        </View>

        <View style={styles.containerSwitch}>
          <Switch
            trackColor={{ false: '#24A8AC', true: '#FFA386' }}
            thumbColor={isEnabled ? 'white' : 'white'}
            ios_backgroundColor="#24A8AC"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View> */}


    </ScrollView>
  );
}




const styles = StyleSheet.create({
  containerSwitch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
    textAlign: 'left',

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

  accentButtonLogout: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20,
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

