import React, { Component } from 'react';
import { Alert, Button, Pressable, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView } from 'react-native';


export default function WelcomeScreen({ navigation, props }) {
  function buttonClicked() {
    navigation.navigate('Login')

  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.titleAndLogo}>
        <Image source={require('../assets/peeach.png')}
          style={styles.logo}
        />
        <Text style={styles.title} numberOfLines={1}> Peach Therapy </Text>
      </View>


      {/* fix this button */}
      <Pressable style={styles.button} onPress={() => buttonClicked()}>
        <Text style={styles.text}>Login</Text>
      </Pressable>
      <TouchableHighlight color="" style={styles.visitOurWebsite} onPress={() => buttonClicked()} title="Visit Our Website">
        <Text style={styles.visitText}>Visit Our Website </Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    width: '50%',

    backgroundColor: '#FFA386',
    borderRadius: 10,

  },
  text: {
    // Login
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 1.26,
    // // wordWrap: 'break-word',
  },


  title: {
    color: '#FFA386',
    fontSize: 33,
    fontWeight: '700',
    textTransform: 'capitalize',
    lineHeight: 33,
    letterSpacing: 0.66,
    // wordWrap: 'break-word',
    marginTop: -40,
  },
  loginButton: {

    width: '50%',
    height: 50,
    backgroundColor: '#FFA386',
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  visitOurWebsite: {

    width: 'auto',
    height: 50,
    backgroundColor: '#FFF6F4',
    borderColor: '#FFA386',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF6F4',
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },
  titleAndLogo: {
    flex: 1,
    position: 'absolute',
    top: 70,
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    // Login
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 17.30,
    letterSpacing: 1.26,
    // wordWrap: 'break-word',
  },
  visitText: {
    // Visit Our Website
    color: '#FFA386',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 17.30,
    letterSpacing: 1.26,
    // wordWrap: 'break-word',
  }

});

