import React, { useState, Component, useEffect } from 'react';
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable, ScrollView, Switch } from 'react-native';
import DropdownComponent from './DropdownComponent';
import { isUserSignedIn, logout } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
export default function AccountPersonalSettings({ navigation, props }) {

  useEffect(() => {
    if (!isUserSignedIn()) navigation.replace("Login")
  })

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

  return (//all
    <ScrollView style={styles.wholePage}>
      <View style={styles.navBar}>
        <SafeAreaView style={styles.container}>
          <Pressable>
            <Image source={require('../assets/Vector-4.png')}
              style={styles.icon}
            />
          </Pressable>
          <Pressable>
            <Image source={require('../assets/Vector.png')}
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={() => goToCalendar()}>
            <Image source={require('../assets/Vector-1.png')}
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={() => goToNotifs()}>
            <Image source={require('../assets/Vector-2.png')}
              style={styles.icon}
            />
          </Pressable>

          <Pressable style={styles.navSelect} onPress={() => buttonClicked()}>
            <Image source={require('../assets/Vector-3.png')} style={styles.icon} />
          </Pressable>
        </SafeAreaView>
      </View>

      <ProfileHeader />

      <View style={styles.pageContainer}>
        <Pressable style={styles.accentButton} onPress={() => buttonClicked()}>
          <Text style={styles.accentButtonText}>Back to Account</Text>
        </Pressable>
        <Pressable style={styles.accentButtonLogout} onPress={() => logoutButtonClicked()}>
          <Text style={styles.accentButtonText}>Logout</Text>
        </Pressable>
        <View style={styles.buttonContainer}>
        </View>
      </View>


      <View style={{ borderBottomWidth: 1, borderColor: '#24A8AC', flexDirection: 'row', }}>
        <View style={{ width: '60%', height: 150, justifyContent: 'center', marginLeft: 20, }}>
          <Text style={styles.title}>
            Push Notifications
          </Text>
          <Text style={styles.body}>
            You may need to enable push notifications in your phone settings.
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
            Microphone Access
          </Text>
          <Text style={styles.body}>
            You may need to enable microphone access in your phone settings.
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
      <View style={{ borderBottomWidth: 1, borderColor: '#24A8AC', flexDirection: 'row', }}>
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
      </View>


      <View style={{ borderBottomWidth: 1, borderColor: '#24A8AC', flexDirection: 'column', paddingBottom: 20, paddingHorizontal: 20, justifyContent: 'space-around' }}>
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.title}>
            Text Notifications
          </Text>
          <Text style={styles.body}>
            Would you like to receive text notifications for appointments, account changes and in-app messages from the Clinician?
          </Text>
        </View>
        <DropdownComponent style={{ margin: 40 }} />

      </View>
      <View style={{ borderBottomWidth: 1, borderColor: '#24A8AC', flexDirection: 'row', }}>
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
      </View>
      <View style={{ borderBottomWidth: 1, borderColor: '#24A8AC', flexDirection: 'row', }}>
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
      </View>


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
