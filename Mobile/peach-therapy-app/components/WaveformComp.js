import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';

export default function WaveformComp({ lines, showDetails }) {

    const [normalizedAudio, setNormalizedAudio] = useState([])
    const [heighestAmp, setHeighestAmp] = useState(0)
    const waveformStyling = showDetails ? { backgroundColor: '#2EAAAE' } : { backgroundColor: '#FFA386' };

    useEffect(() => {
        console.log(lines)
        setNormalizedAudio(resizeAudioData(lines))
        //NAZU THIS IS WHERE WE LEFT OFF PROPRETY EXCEEDS 19200 objects or sumshit
        setHeighestAmp(Math.max(...lines))
    }, []);


    function turnAudioLineIntoPercentForCSS(value) {
        const percentpart = (value / heighestAmp) * 100
        const percent = percentpart + 10
        // console.log(percent)
        return percent + '%'
    }


    function resizeAudioData(originalArray) {
        const originalSize = originalArray.length
        // console.log(originalSize)
        const newSize = 35
        const ratio = originalSize / newSize
        const newArray = []

        for (let i = 0; i < newSize; i++) {
            const newIndex = Math.floor(i * ratio);
            // console.log(originalArray[newIndex])
            newArray.push(originalArray[newIndex] + 300)
            // console.log(i, Math.floor(i*ratio), originalArray[newIndex])
        }

        return newArray;
    }

    return (
        <View style={styles.waveformContainer}>

            {normalizedAudio.map((audioLine, index) => (
                <View key={index} style={{ ...styles.waveformLine, minHeight: 2, height: turnAudioLineIntoPercentForCSS(audioLine), ...waveformStyling }} />
            ))
            }

        </View>
    )
}

const styles = StyleSheet.create({
    singleRecording: {
        width: "90%",
        padding: 20,
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: '#FEE7DD',
        borderRadius: 10,
        borderColor: '#F1C4B6',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.05,
        shadowRadius: 6,

    },
    waveformContainer: {

        marginVertical: 40,
        //width: "100%",
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',


    },
    waveformLine: {
        borderRadius: 9999,
        //marginRight: '1%',
        width: '2%',
        backgroundColor: '#FFA386',
    },

    text: {
        color: '#2EAAAE',
        fontWeight: '700',

    },

    accountInfo: {
        //flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        padding: 10,
        height: 100,
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
        color: 'black',
        //font-family: Montserrat,
        fontSize: 18,
        //fontStyle: normal,
        fontWeight: '700',
        lineHeight: 18.5, /* 123.333% */
        letterSpacing: 0.5,
    },
    profileSubheading: {
        color: 'black',
        //fontFamily: '',
        fontSize: 14,
        //fontStyle: normal,
        fontWeight: '300',
        lineHeight: 15, /* 123.333% */
        letterSpacing: 0,
        // wordWrap: 'break-word',
    },
    button: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: 'center',
        textAlign: 'center',
        borderColor: '#2EAAAE',
        borderWidth: 2,
        margin: 20,

    },
    icon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    }

})