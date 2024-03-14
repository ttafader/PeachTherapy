import React, { Component, useEffect } from 'react';
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable, ScrollView } from 'react-native';
import { isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';

export default function Tutorial({ navigation, props }) {

  useEffect(() => {
    if (!isUserSignedIn()) navigation.replace("Login")
  })

  function buttonClicked() {
    navigation.navigate('Account')
  }
  function goToCalendar() {
    navigation.navigate('Calendar')

  }

  function goToNotifs() {
    navigation.navigate('Notifications')
  }

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
        <View style={styles.buttonContainer}>


          <Text style={styles.title}>
            Tutorials & How-Tos
          </Text>
          <View style={{
            backgroundColor: '#BAEAEF',
            height: 100,
            width: 200,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,

          }}>
            <Text style={{
              color: '#24A8AC',
              fontWeight: '600',
              fontSize: 12,
            }}> Click here to play your most recent audio recording. </Text>
          </View>

          <Image source={require('../assets/waveform.png')}
            style={styles.tutorial}
          />

          <View style={{
            backgroundColor: '#BAEAEF',
            marginTop: 20,
            height: 60,
            width: 200,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,

          }}>
            <Text style={{
              color: '#24A8AC',
              fontWeight: '600',
              fontSize: 12,
            }}> The duration of the recoding can be found here. </Text>
            <Image source={require('../assets/Vector 5.png')}
              style={{
                position: 'absolute',
                left: 190,
                top: - 40,
              }}
            />
          </View>
          <View style={{
            backgroundColor: '#BAEAEF',
            marginTop: 20,
            height: 100,
            width: 200,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,

          }}>
            <Text style={{
              color: '#24A8AC',
              fontWeight: '600',
              fontSize: 12,
            }}> Here you can find the clinician’s description and analysis of the recording. </Text>
            <Image source={require('../assets/Vector 7.png')}
              style={{
                position: 'absolute',
                left: -10,
                top: 80,
              }}
            />
          </View>


          <View style={{
            width: 325,
            height: '',
            margin: 40,
            borderRadius: 10,
            borderWidth: 3,
            borderColor: '#24A8AC',
          }}>


            <View style={{
              flexDirection: 'row',
              height: 160,
              width: '100%',
              padding: 25,
              marginBottom: 15,
            }}>

              <View style={{
                borderRadius: 10,
                width: 120,
                height: 120,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 15,

              }}>
                <Text style={{
                  color: '#24A8AC',
                  fontSize: 70,
                  fontWeight: '600',
                  letterSpacing: -1,

                }}>01</Text>
              </View>

              <View style={{
                width: '100%',
                paddingHorizontal: 20,
                justifyContent: 'center',
              }}>
                <Text style={{
                  color: '#24A8AC',
                  fontWeight: '700',
                  fontSize: 14,

                }}>Placeholder</Text>
                <Text style={{
                  color: '#78D6D9',
                  fontWeight: '400',
                }}>Nemo enim ipsam {'\n'} voluptatem quia{'\n'} voluptas sit{'\n'}aspernatur </Text>

              </View>
            </View>
            <View style={
              {
                paddingHorizontal: 40,
                paddingBottom: 40,
              }
            }>
              <Image source={require('../assets/Group 98.png')}
                style={{
                  width: 60,
                  height: 60,
                  position: 'absolute',
                  left: 90,
                  top: -70,
                }}
              />
              <Text style={{
                color: '#78D6D9',
                fontWeight: '400',
              }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod sem id mauris condimentum, quis vulputate diam commodo. Nullam accumsan dignissim tortor porta commodo. Sed et lectus tincidunt, dictum mauris ac, egestas ipsum. Etiam euismod orci a orci euismod, ut ultrices sem fringilla. Proin efficitur rutrum mi, vitae aliquam mauris tempus ac. Pellentesque eget nisi lacus. Ut et ex feugiat tellus dapibus laoreet sit amet sed metus. Sed consequat lobortis leo eget mollis. Proin vitae nisl in elit aliquam tempor. Mauris tincidunt fermentum purus in molestie. Proin quis turpis urna.
              </Text>
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
  tutorial: {
    // Login
    color: 'white',
    height: 104,
    width: 251,
  },



});

