import React, { Component, useEffect } from 'react';
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable, ScrollView } from 'react-native';
import { isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';

export default function Calendar({ navigation, props }) {

  useEffect(() => {
    if (!isUserSignedIn()) navigation.replace("Login")
  })

  function buttonClicked() {
    navigation.navigate('Account')
  }
  function goToChart() {
    navigation.navigate('DonutChart')
  }
  function goToNotifs() {
    navigation.navigate('Notifications')
  }
  function goToRecordings() {
    navigation.navigate('Waveform')
  }
  return (//all
    <ScrollView style={styles.wholePage}>
      <View style={styles.navBar}>
        <SafeAreaView style={styles.container}>
          <Pressable onPress={() => goToRecordings()}>
            <Image source={require('../assets/Vector-4.png')}
              style={styles.icon}
            />
          </Pressable>

          <Pressable onPress={() => goToChart()}>
            <Image source={require('../assets/Vector.png')}
              style={styles.icon}
            />
          </Pressable>

          <View style={styles.navSelect}>
            <Image source={require('../assets/calselect.png')} style={styles.icon} />
          </View>

          <Pressable onPress={() => goToNotifs()}>
            <Image source={require('../assets/Vector-2.png')}
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={() => buttonClicked()}>
            <Image source={require('../assets/man.png')}
              style={styles.icon}
            />
          </Pressable>
        </SafeAreaView>
      </View>

      <ProfileHeader />

      <View style={styles.pageContainer}>

        <Text style={styles.title}>
          Your Upcoming Appointments
        </Text>


        <View style={{
          width: 325,
          margin: 40,
          borderRadius: 10,
          backgroundColor: '#FDF1E4',
        }}>
          <View style={{
            flexDirection: 'row',
            height: 24,
            backgroundColor: '#FFA386',
            width: '100%',
            borderRadius: 10,
          }}>

            <View style={{
              height: 40,
              width: 28,
              backgroundColor: '#F08462',
              borderRadius: 10,
              position: 'absolute',
              left: 38,
              top: -25,
            }}></View>

            <View style={{
              height: 40,
              width: 28,
              backgroundColor: '#F08462',
              borderRadius: 10,
              position: 'absolute',
              right: 38,
              top: -25,
            }}></View>


          </View>
          <View style={{
            flexDirection: 'row',
            height: 160,
            width: '100%',
            padding: 25,
            marginBottom: 15,
          }}>

            <View style={{
              borderRadius: 10,
              borderWidth: 3,
              borderColor: '#FFBCA7',
              width: 120,
              height: 120,
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 15,

            }}>
              <Text style={{
                color: '#F08462',
                fontSize: 28,
                fontWeight: '700',
                letterSpacing: 2,
                lineHeight: 28,
              }}>JAN</Text>
              <Text style={{
                color: '#FFC7AF',
                fontSize: 60,
                fontWeight: '700',
                letterSpacing: -1,
                lineHeight: 60,
              }}>01</Text>
            </View>

            <View style={{
              width: '100%',
              paddingHorizontal: 20,
              justifyContent: 'center',
            }}>
              <Text style={{
                color: '#F08462',
                fontWeight: '700',
                fontSize: 14,
                marginBottom: 20,
              }}>Appointment with {'\n'}Dr. Tajmina Tafader </Text>
              <Text style={{
                color: '#78D6D9',
                fontWeight: '700',
              }}>1:00 PM - 2:00 PM</Text>
              <Text style={{
                color: '#F08462',
              }}>Practice “Frown”</Text>
            </View>

          </View>
        </View>




        <View style={{
          width: 325,
          margin: 40,
          borderRadius: 10,
          backgroundColor: '#F1F5F9',
        }}>
          <View style={{
            flexDirection: 'row',
            height: 24,
            backgroundColor: '#CBD5E1',
            width: '100%',
            borderRadius: 10,
          }}>

            <View style={{
              height: 40,
              width: 28,
              backgroundColor: '#94A3B8',
              borderRadius: 10,
              position: 'absolute',
              left: 38,
              top: -25,
            }}></View>

            <View style={{
              height: 40,
              width: 28,
              backgroundColor: '#94A3B8',
              borderRadius: 10,
              position: 'absolute',
              right: 38,
              top: -25,
            }}></View>


          </View>
          <View style={{
            flexDirection: 'row',
            height: 160,
            width: '100%',
            padding: 25,
            marginBottom: 15,
          }}>

            <View style={{
              borderRadius: 10,
              borderWidth: 3,
              borderColor: '#94A3B8',
              width: 120,
              height: 120,
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 15,

            }}>
              <Text style={{
                color: '#64748B',
                fontSize: 28,
                fontWeight: '700',
                letterSpacing: 2,
                lineHeight: 28,
              }}>JAN</Text>
              <Text style={{
                color: '#B9C6D8',
                fontSize: 60,
                fontWeight: '700',
                letterSpacing: -1,
                lineHeight: 60,
              }}>16</Text>
            </View>

            <View style={{
              width: '100%',
              paddingHorizontal: 20,
              justifyContent: 'center',
            }}>
              <Text style={{
                color: '#94A3B8',
                fontWeight: '700',
                fontSize: 14,
                marginBottom: 20,
              }}>Tentative {'\n'} Appointment with {'\n'}Dr. Tajmina Tafader {'\n'}- To be confirmed </Text>
              <Text style={{
                color: '#78D6D9',
                fontWeight: '700',
              }}>1:00 PM - 2:00 PM</Text>

            </View>

          </View>
        </View>


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

