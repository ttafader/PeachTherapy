import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, ActivityIndicator, Pressable, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, Keyboard, RefreshControl } from 'react-native';
import { signin } from '../apis/authenticationAPIs';
import BackButton from '../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserDetails } from '../apis/authenticationAPIs';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signinError, setSigninError] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [user, setUser] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (event) => {
    const currentScrollPosition = event.nativeEvent.contentOffset.y;
    setScrollPosition(currentScrollPosition);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setUser(await getUserDetails());
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);

    setUsername('');
    setPassword('');
    setSigninError(0);
  };

  useEffect(() => {
    return () => {
      setRefreshing(false);
    };
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  async function buttonClicked() {
    setLoading(true);
    await signin(username, password).then(code => {
      setSigninError(code);
      setLoading(false);

      if (code === 1) {
        navigation.navigate("Account");
      }
    });
  }

  const logoStyle = keyboardVisible ? { width: 150, height: 150 } : { width: 300, height: 300 };
  const titleStyle = keyboardVisible ? { fontSize: 20, lineHeight: 20, marginTop: -30 } : { fontSize: 33, lineHeight: 33 };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container} >
      <ScrollView style={{ flex: 1, width: '100%' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FFA386']}
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 40,
        }}>
          <View style={styles.titleAndLogo}>
            <Image source={require('../assets/peeach.png')} style={[styles.logo, logoStyle]} />
            <Text style={[styles.title, titleStyle]}>{'Peach Therapy'}</Text>
          </View>
          {
            signinError < 0 && (
              signinError === -1 ? (
                <Text style={styles.errorMessage}>Login Error: Username Incorrect</Text>
              ) : signinError === -2 ? (
                <Text style={styles.errorMessage}>Login Error: Password Incorrect</Text>
              ) : (
                <Text style={styles.errorMessage}>Login Error: Unknown Error</Text>
              )
            )
          }
          <Text style={styles.placeholderCaptions}>Username</Text>
          <TextInput
            style={signinError === -1 ? [styles.errorInput, styles.errorPlaceholderText] : [styles.writingInput, styles.placeholderText]}
            placeholder="eg. johndoe@email.com"
            textAlignVertical="top"
            underlineColorAndroid="transparent"
            onChangeText={(e) => setUsername(e)}
            value={username}
          />
          <Text style={styles.placeholderCaptions}>Password</Text>
          <TextInput
            style={signinError === -2 ? [styles.errorInput, styles.errorPlaceholderText] : [styles.writingInput, styles.placeholderText]}
            secureTextEntry={true}
            placeholder="eg. Peach123* "
            onChangeText={(e) => setPassword(e)}
            value={password}
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
          {/* 
          <SafeAreaView style={styles.backButtonContainer}>
            <BackButton navigation={navigation} colorBG={'#FFC1AD'}></BackButton>
          </SafeAreaView> */}
        </View>
      </ScrollView>
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
    marginBottom: 20,
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
    marginTop: -80,
    marginBottom: 40,
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
    color: '#FFA386',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  titleAndLogo: {
    justifyContent: "center",
    marginTop: 50, // Increase marginTop to prevent the top of the image being cut off
    alignItems: "center",
    marginBottom: 20, // Reduce marginBottom to create a more balanced spacing
    // backgroundColor: 'black'
  },
  backButtonContainer: {
    width: 150,
    marginBottom: 10, // Reduce marginBottom to reduce the space around the BackButton
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

