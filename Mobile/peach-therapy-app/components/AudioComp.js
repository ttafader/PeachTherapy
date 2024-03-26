import React, { useEffect, useState, Component } from 'react'
import { Audio } from 'expo-av';
import { getUserDetails, isUserSignedIn } from '../apis/authenticationAPIs'
import { getPerson } from '../utilities/database_functions'
import { Text, TouchableHighlight, SafeAreaView, StyleSheet, Pressable, View, Image, ScrollView, Button } from 'react-native';
import moment from 'moment';
import { getTextFileFromStorage, getWavFileFromStorage } from '../apis/storageAPIs';
// import { audiodataarray } from './audioData';
// import { getAllDoctorsData, getAllPatientsData } from "../apis/databaseAPIs";


export default function AudioComp({ recording, idx }) {
    const [user, setUser] = useState({})

    const [normalizedAudio, setNormalizedAudio] = useState([])
    const [heighestAmp, setHeighestAmp] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [sound, setSound] = useState();
    const [showDetails, setShowDetails] = useState(false);
    const buttonClicked = () => { toggleDetails(); };
    const toggleDetails = () => { setShowDetails(!showDetails); };

    const textStyle = showDetails ? { color: '#2EAAAE' } : { color: '#FFA386' };
    const waveformStyling = showDetails ? { backgroundColor: '#2EAAAE' } : { backgroundColor: '#FFA386' };
    const containerStyle = showDetails ? { backgroundColor: '#E1F3F3', borderColor: '#2EAAAE' } : { backgroundColor: '#FEE7DD', borderColor: '#FFA386' };

    async function playSound() {
        try {

            console.log('Loading Sound');
            const wavFileUri = await getWavFileFromStorage(recording.wav_url);
            console.log('WAV File URI:', wavFileUri); // Log the URI to verify if it's correct
            const { sound } = await Audio.Sound.createAsync({ uri: wavFileUri });

            setSound(sound);

            console.log('Playing Sound');
            await sound.playAsync();
        } catch (error) {
            console.error('Error loading or playing sound:', error);
        }
    }

    async function getSoundData() {
        const lines = await getTextFileFromStorage(recording.txt_url)
        console.log(lines[0])
    }

    function convertDateString(date) {
        dateObj = moment(date)

        return {
            formatted: dateObj.format('DD-MMM-YYYY'),
            fromNow: dateObj.fromNow(),
        }
    }

    function detailsClicked() {
        navigation.navigate('WaveFormDetails')
        //call firebase sign in function and send username password variable as param
    }


    // function resizeAudioData(originalArray) {
    //     const originalSize = originalArray.length
    //     // console.log(originalSize)
    //     const newSize = 35
    //     const ratio = originalSize / newSize
    //     const newArray = []

    //     for (let i = 0; i < newSize; i++) {
    //         const newIndex = Math.floor(i * ratio);
    //         // console.log(originalArray[newIndex])
    //         newArray.push(originalArray[newIndex] + 0.02)
    //         // console.log(i, Math.floor(i*ratio), originalArray[newIndex])
    //     }

    //     return newArray;
    // }

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    function turnAudioLineIntoPercentForCSS(value) {
        const percent = (value / heighestAmp) * 100
        return percent + '%'
    }

    const openDetails = () => {
        buttonClicked(); // Toggle details regardless of playing state
    }


    return recording.phrase && (
        <Pressable style={[styles.singleRecording, containerStyle]}>
            <Pressable style={[styles.button]} onPress={openDetails}>
                <Text style={[styles.text, textStyle]}>View More Details</Text>
            </Pressable>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 80, color: '#FFA386', opacity: 0.6, fontWeight: '500', marginTop: 10, ...textStyle }}>
                    {idx + 1}
                </Text>
                <View style={{ justifyContent: 'center', padding: 25 }}>
                    <Text style={{ color: '#FFA386', fontSize: 30, fontWeight: '700', ...textStyle }}>
                        {convertDateString(recording.date_recorded).fromNow}
                    </Text>
                    <Text style={{ color: '#FFA386', fontSize: 15, fontWeight: '700', ...textStyle }}>
                        {convertDateString(recording.date_recorded).formatted}
                    </Text>
                    <Text style={{ color: '#FFA386', fontWeight: '500', maxWidth: 200, ...textStyle }}>
                        Phrase: "{recording.phrase}"
                    </Text>
                </View>
            </View>
            {showDetails && (
                <View>
                    <View style={styles.waveformContainer}>

                        <Button title="Play Sound" onPress={playSound} />
                        <Button title="Print Text" onPress={getSoundData} />
                        {/* {normalizedAudio.map(audioLine => (
                            <View style={{ ...styles.waveformLine, height: turnAudioLineIntoPercentForCSS(audioLine), ...waveformStyling }} />
                        ))} */}

                    </View>
                </View>
            )}
            {showDetails && (
                <Pressable style={[styles.button]} onPress={detailsClicked}>
                    <Text style={[styles.text, textStyle]}>View More Details</Text>
                </Pressable>
            )}
        </Pressable>

    )
}

const styles = StyleSheet.create({
    singleRecording: {
        padding: 30,
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: '#FEE7DD',
        borderRadius: 10,
        borderColor: '#F1C4B6',
        borderWidth: 2,

    },
    waveformContainer: {

        marginLeft: 1,
        //width: "100%",
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,

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

})