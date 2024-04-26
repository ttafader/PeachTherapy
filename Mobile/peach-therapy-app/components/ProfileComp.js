import React, { useEffect, useState } from 'react'
import { getUserDetails } from '../apis/authenticationAPIs'
import { getPerson } from '../utilities/database_functions'

import { Text, StyleSheet, Pressable, View, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';

export default function ProfileComp({ navigation, patient_id }) {
    const [user, setUser] = useState({})
    const [patientObject, setPatientObject] = useState({})

    const [patientName, setPatientName] = useState("Unknown")
    const [imageDisplay, setImageDisplay] = useState("Unknown")
    const [birthDate, setBirthdate] = useState("Unknown")

    function viewProfileClicked() {
        navigation.navigate('ClinicianMenu', { patientObject: patientObject });
        // Navigate to 'PatientDetails' screen and pass patientDetails as a parameter
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const tempArray = await getPerson(2, 'number', patient_id);
                const temp = tempArray[0];
                setPatientObject(temp)
                processPatientObject(temp)
            } catch (error) {
                console.error("Error fetching patient details:", error);
            }
        }
        fetchData();
    }, []);

    function processPatientObject(obj) {
        if (obj &&
            obj.profile &&
            obj.profile.first_name &&
            obj.profile.last_name &&
            obj.profile.img_url) {
            setPatientName(obj.profile.first_name + " " + obj.profile.last_name)

            setImageDisplay(obj.profile.img_url)
            setBirthdate(obj.profile.birthday)
        }
    }

    return (
        <Pressable style={[styles.singleRecording]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 25, width: "70%" }}>
                    <Image src={imageDisplay} style={styles.profilePic} />
                    <Text style={{ color: '#FFA386', textAlign: 'center', fontWeight: '700', fontSize: 24, maxWidth: 200 }}>
                        {patientName}
                    </Text>
                    <Text style={{ color: '#FFA386', fontWeight: '500', maxWidth: 200 }}>
                        {birthDate}
                    </Text>
                </View>
            </View >
            <Pressable style={[styles.button]} onPress={viewProfileClicked}>
                <Text style={[styles.text]}>View Profile</Text>
            </Pressable>
        </Pressable >
    )
}


const styles = StyleSheet.create({
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 10,
    },
    singleRecording: {
        width: "90%",
        paddingBottom: 20,
        marginTop: 40,
        marginHorizontal: 25,
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
        margin: 5,

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
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: 20,

    }

})