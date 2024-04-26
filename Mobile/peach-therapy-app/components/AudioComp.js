import React, { useEffect, useState, Component } from 'react'
import { Audio } from 'expo-av';
import { getUserDetails, isUserSignedIn } from '../apis/authenticationAPIs'
import { getPerson } from '../utilities/database_functions'
import { Text, TouchableHighlight, SafeAreaView, StyleSheet, Pressable, View, Image, ScrollView, Button, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { getTextFileFromStorage, getWavFileFromStorage } from '../apis/storageAPIs';
import { audiodataarray } from '../screens/waste/audioData';
import WaveformComp from './WaveformComp';
// import { getAllDoctorsData, getAllPatientsData } from "../apis/databaseAPIs";


export default function AudioComp({ navigation, recording, idx }) {
    const [user, setUser] = useState([])

    const [sound, setSound] = useState();
    const [soundData, setSoundData] = useState();
    const [showDetails, setShowDetails] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const textStyle = showDetails ? { color: '#2EAAAE' } : { color: '#FFA386' };
    const containerStyle = showDetails ? { backgroundColor: '#E1F3F3', borderColor: '#2EAAAE' } : { backgroundColor: '#FEE7DD', borderColor: '#FFA386' };

    const [detailsText, setDetailsText] = useState("View More Details");

    // Function to toggle details and text
    const toggleDetails = () => {
        setShowDetails(!showDetails);
        setDetailsText(showDetails ? "View More Details" : "Show Less");
    };

    // Function to handle button click
    const buttonClicked = () => {
        toggleDetails();
    };

    async function playSound() {
        try {
            if (!isPlaying) {
                console.log('Loading Sound');
                const wavFileUri = await getWavFileFromStorage(recording.wav_url);
                console.log('WAV File URI:', wavFileUri); // Log the URI to verify if it's correct
                const { sound } = await Audio.Sound.createAsync({ uri: wavFileUri });

                setSound(sound);
                setIsPlaying(true);

                console.log('Playing Sound');
                await sound.playAsync();
            } else {
                setIsPlaying(false);
                await sound.stopAsync();
            }
        } catch (error) {
            console.error('Error loading or playing sound:', error);
        }
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

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    useEffect(() => {
        async function loadSoundData() {
            // console.log('loading', recording.text_url)
            const lines = await getTextFileFromStorage(recording.text_url);
            setSoundData(lines)
        }
        loadSoundData()
    }, []);

    return recording && (
        <Pressable style={[styles.singleRecording, containerStyle]}>
            <TouchableOpacity onPress={buttonClicked} style={{ marginBottom: 20 }}>
                <Text style={[styles.text, textStyle]}>{detailsText}</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 80, lineHeight: 80, marginLeft: 50, color: '#FFA386', opacity: 0.6, fontWeight: '500', marginTop: 10, ...textStyle }}>
                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                </Text>

                <View style={{ justifyContent: 'center', padding: 25, width: "70%" }}>
                    <Text style={{ color: '#FFA386', fontSize: 25, fontWeight: '700', ...textStyle }}>
                        {convertDateString(recording.date_recorded).fromNow}
                    </Text>
                    <Text style={{ color: '#FFA386', fontSize: 15, fontWeight: '600', ...textStyle }}>
                        {convertDateString(recording.date_recorded).formatted}
                    </Text>
                </View >
            </View >
            {showDetails && (
                <View>
                    {/* <Button title="Print Text" onPress={getSoundData} /> */}
                    <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 20, marginBottom: 10, ...textStyle }}>

                        <Text style={{ color: '#FFA386', marginHorizontal: 20, fontWeight: '500', textAlign: 'center', ...textStyle }}>
                            Phrase: "{recording.phrase}"
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={playSound} style={{ padding: 20 }}>
                            <Image
                                source={isPlaying ? require('../assets/pause.png') : require('../assets/play.png')}
                                style={styles.icon}
                            />
                        </TouchableOpacity>

                        {soundData && <WaveformComp lines={soundData} showDetails={showDetails} />}
                        {/* {soundData && <WaveformComp lines={audiodataarray} showDetails={showDetails} />} */}
                    </View>
                </View >
            )
            }
            {
                showDetails && (
                    <Pressable style={[styles.button]} onPress={detailsClicked}>
                        <Text style={[styles.text, textStyle]}>View Report</Text>
                    </Pressable>
                )
            }
        </Pressable >

    )
}

const styles = StyleSheet.create({
    singleRecording: {

        width: "90%",
        padding: 30,
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


        fontSize: 18,
        //fontStyle: normal,
        fontWeight: '700',
        lineHeight: 18.5, /* 123.333% */
        letterSpacing: 0.5,
    },
    profileSubheading: {
        color: 'black',
        //fontFamily: '',

        //fontFamily: "Montserrat",
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