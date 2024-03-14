import React, { Component, useState } from 'react';
import { Alert, ActivityIndicator, Button, TouchableHighlight, StyleSheet, Text, KeyboardAvoidingView, View, Image, TextInput, SafeAreaView, AreaChart, Pressable } from 'react-native';
import { signin } from '../apis/authenticationAPIs';

export default function LoginScreen({ navigation, props }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [signinError, setSigninError] = useState(0)
  const [loading, setLoading] = useState(false)
  // function buttonClicked() {
  //   navigation.navigate('Account')
  // }
  async function buttonClicked() {
    setLoading(true)
    await signin(username, password).then(code => {
      setSigninError(code)
      setLoading(false)
      console.log(code)

      if (code == 1) {
        navigation.navigate("Account")
      }
    })
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>

      <View style={styles.titleAndLogo}>
        <Image source={require('../assets/peeach.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>{'Peach\nTherapy'}</Text>
      </View>

      {
        signinError < 0 && (
          signinError === -1 ?
            <Text style={styles.errorMessage}>Login Error: Username Incorrect</Text>
            : signinError === -2 ?
              <Text style={styles.errorMessage}>Login Error: Password Incorrect</Text>
              :
              <Text style={styles.errorMessage}>Login Error: Unknown Error</Text>
        )
      }

      <Text style={styles.placeholderCaptions}>
        Username
      </Text>
      <TextInput
        style={
          signinError === -1 ? [
            styles.errorInput,
            styles.errorPlaceholderText
          ] : [
            styles.writingInput,
            styles.placeholderText
          ]
        }
        placeholder="eg. johndoe@email.com"
        textAlignVertical="top"
        underlineColorAndroid="transparent"
        onChangeText={(e) => setUsername(e)}
      />
      <Text style={styles.placeholderCaptions}>
        Password
      </Text>
      <TextInput
        style={
          signinError === -2 ? [
            styles.errorInput,
            styles.errorPlaceholderText
          ] : [
            styles.writingInput,
            styles.placeholderText
          ]
        }
        secureTextEntry={true}
        placeholder="eg. Peach123* "
        onChangeText={(e) => setPassword(e)}
      />

      <Pressable disabled={loading} style={styles.button} onPress={() => buttonClicked()}>
        {loading ?
          <ActivityIndicator size={'small'} color={'#FFFFFF'} />
          :
          <Text style={styles.text}>Login</Text>
        }
      </Pressable>
      <Pressable onPress={() => Alert.alert('This Button Changes Password')}>
        <Text style={styles.forgotPassword}>Forgot Password</Text>
      </Pressable>
    </KeyboardAvoidingView>
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
    // wordWrap: 'break-word',
  },

  title: {
    color: '#FFA386',
    fontSize: 33,
    fontWeight: '700',
    textTransform: 'capitalize',
    lineHeight: 33,
    letterSpacing: 0.66,
    // wordWrap: 'break-word',
    marginTop: -60,
    textAlign: 'center',
  },

  placeholderCaptions: {
    justifyContent: "flex-start",
    color: '#FF5929',
    width: '70%',
    fontWeight: '500',
    marginTop: -10,
    marginBottom: 5,
  },

  forgotPassword: {
    // Login
    color: '#FFA386',
    fontSize: 16,
    //fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 1.26,
    // wordWrap: 'break-word',
    textDecorationLine: 'underline',
    marginBottom: 100,
    marginTop: 20,
  },

  writingInput: {

    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(103, 178, 181, 0.16)',
    /* baby shadow */
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 20,
    width: '70%'

  },

  errorInput: {

    height: 40,
    borderRadius: 10,
    backgroundColor: '#FED6D0',
    /* baby shadow */
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 20,
    width: '70%'

  },

  errorPlaceholderText: {
    opacity: '38%',
    color: '#DC1A00',
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: '400',
    lineHeight: 18.5, /* 142.308% */
    letterSpacing: 0.585,
  },

  container: {
    flex: 1,
    backgroundColor: '#FFF6F4',
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  titleAndLogo: {
    flex: 1,
    //top: 70,
    justifyContent: "center",
    alignItems: "center",
  },


  placeholderText: {
    color: '#24A8AC',
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: '400',
    lineHeight: 18.5, /* 142.308% */
    letterSpacing: 0.585,
  },
  errorMessage: {
    justifyContent: "center",
    textAlign: "center",
    color: '#DC1A00',
    width: '70%',
    fontWeight: '700',
    marginTop: -10,
    marginBottom: 40,
  }

});

