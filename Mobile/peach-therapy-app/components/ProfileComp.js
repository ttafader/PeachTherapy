import React, { useEffect, useState } from 'react'
import { getUserDetails } from '../apis/authenticationAPIs'
import { getPerson } from '../utilities/database_functions'

import { Text, StyleSheet, Pressable, View, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';

export default function ProfileComp({ patients, navigation, idx }) {
    const [user, setUser] = useState({})
    const [patientDetails, setPatientDetails] = useState({});

    function detailsClicked() {
        navigation.navigate('PatientDetails', { patientDetails: patientDetails });
        // Navigate to 'PatientDetails' screen and pass patientDetails as a parameter
    }

    useEffect(() => {
        async function fetchData() {
            const tempUser = await getUserDetails();
            setUser(tempUser);
            loadPatientDetails(tempUser.patients[idx]);
        }
        fetchData();
    }, []);

    async function loadPatientDetails(uid) {
        try {
            const tempArray = await getPerson(2, 'number', uid);
            const temp = tempArray[0];
            if (temp && temp.profile && temp.profile.first_name && temp.profile.last_name && temp.profile.img_url) {
                setPatientDetails({
                    patientName: temp.profile.first_name + " " + temp.profile.last_name,
                    imageDisplay: temp.profile.img_url,
                    birthDate: temp.profile.birthday
                });
            } else {
                setPatientDetails({
                    patientName: "Unknown",
                    imageDisplay: "Unknown",
                    birthDate: "Unknown"
                });
            }
        } catch (error) {
            console.error("Error fetching patient details:", error);
            setPatientDetails({
                patientName: "Unknown",
                imageDisplay: "Unknown",
                birthDate: "Unknown"
            });
        }
    }

    return (
        <Pressable style={[styles.singleRecording]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 25, width: "70%" }}>
                    <Image src={patientDetails.imageDisplay} style={styles.profilePic} />
                    <Text style={{ color: '#FFA386', textAlign: 'center', fontWeight: '700', fontSize: 24, maxWidth: 200 }}>
                        {patientDetails.patientName}
                    </Text>
                    <Text style={{ color: '#FFA386', fontWeight: '500', maxWidth: 200 }}>
                        {patientDetails.birthDate}
                    </Text>
                </View>
            </View>
            <Pressable style={[styles.button]} onPress={detailsClicked}>
                <Text style={[styles.text]}> View Profile</Text>
            </Pressable>
        </Pressable>
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
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: 20,

    }

})