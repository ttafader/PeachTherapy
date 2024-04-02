import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, Pressable, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { isUserSignedIn, getUserDetails } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
import PatientNavComp from '../components/PatientNavComp';
import ClinicianNavComp from '../components/ClinicianNavComp';
import BackButton from '../components/BackButton';

export default function AccountSettings({ navigation }) {
  const [user, setUser] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isUserSignedIn()) {
      navigation.replace("Login");
    } else {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    setUser(await getUserDetails());
  }

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

  return user.profile && (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
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
        <BackButton navigation={navigation} colorBG={'#24A8AC'} />
        <SafeAreaView style={styles.pageContainer}>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.text}>Account Settings</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Tutorial')}>
              <Text style={styles.text}>Tutorials & How to’s</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Terms')}>
              <Text style={styles.text}>Terms & Conditions</Text>
            </Pressable>
          </View>
          <Pressable style={styles.accentButton} onPress={() => Alert.alert('This Button Contacts Clinician')}>
            <Text style={styles.accentButtonText}>Contact Your Clinician</Text>
          </Pressable>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    height: 120,
    backgroundColor: '#24A8AC',
  },
  buttonContainer: {
    height: '60%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 20,
    backgroundColor: '#EDFDFF',
    borderRadius: 10,
    borderColor: '#24A8AC',
    borderWidth: 2,
  },
  text: {
    color: '#24A8AC',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
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
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  pageContainer: {
    flex: 1,
    margin: 50,
    height: '',
    alignItems: 'space-between',
    justifyContent: 'space-between',
  },
});
