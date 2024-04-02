import React, { Component, useEffect } from 'react';
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable } from 'react-native';
import { isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from './ProfileHeader';

export default function BackButton({ navigation, colorBG }) {

  return (//all
    <View>
      <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colorBG, margin: 5, borderRadius: 10 }}>
        <Image source={require('../assets/backbutton.png')} style={{
          width: 10,
          height: 10,
          margin: 10,
          resizeMode: 'contain',
        }}
        />
        <Text style={{ color: 'white' }}>
          Back
        </Text>

      </Pressable>
    </View>
  );
}
