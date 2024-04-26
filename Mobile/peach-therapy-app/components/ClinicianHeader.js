import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { getUserDetails } from '../apis/authenticationAPIs'
import { getPerson } from '../utilities/database_functions'

export default function ClinicianHeader({ patientObject, colorBG }) {
    const [user, setUser] = useState({})

    const [doctorName, setDoctorName] = useState("")

    // const [clinic, setClinic] = useState("") // Define clinic state

    useEffect(() => {
        async function loadUserData() {
            getDoctorName(patientObject.profile.doctor_id)

        }
        loadUserData()


    }, [])

    useEffect(() => {
        async function loadUserData() {

            setUser(patientObject);
            const doctorDetails = await getDoctorDetails(patientObject.profile.doctor_id);
            // console.log("Doctor Details:", doctorDetails);
            setDoctorName(doctorDetails.doctorName);
            setClinic(doctorDetails.clinic);
        }
        loadUserData();
    }, []);

    async function getDoctorDetails(uid) {
        try {
            const patientObjectArray = await getPerson(1, uid);
            const patientObject = patientObjectArray[0]; // Access the first element of the array
            // console.log("Doctor patientObject:", patientObject);
            if (patientObject && patientObject.profile && patientObject.profile.first_name && patientObject.profile.last_name && patientObject.profile.clinic) {
                return {
                    doctorName: patientObject.profile.first_name + " " + patientObject.profile.last_name,
                    clinic: patientObject.profile.clinic
                };
            } else {
                return { doctorName: "Unknown", clinic: "Unknown" };
            }
        } catch (error) {
            // console.error("Error fetching doctor details:", error);
            return { doctorName: "Unknown", clinic: "Unknown" };
        }
    }


    async function getDoctorName(uid) {
        const docTemp = await getPerson(1, uid)
        // console.log(uid)
        await setDoctorName(docTemp.profile.first_name + " " + docTemp.profile.last_name)

    }


    return user.profile && (
        <View style={[styles.accountInfo, { backgroundColor: colorBG }]}>
            <View style={styles.imgDescripCont}>

                <Image src={user.profile.img_url} style={styles.profilePic} />
                <View style={styles.accountInfoContainer}>
                    <Text style={styles.profileDescription}>{user.profile.first_name} {user.profile.last_name}</Text>
                    <Text style={styles.profileSubheading}>Patient with Dr. {doctorName}</Text>

                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    accountInfo: {
        //flex: 1,
        flexDirection: 'row',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 5,
        marginHorizontal: 5,
        padding: 25,
        height: 130,
        // backgroundColor: '#24A8AC',
        // backgroundColor: '#FFA386',
        // justifyContent: 'center',
        // alignItems: 'center',

        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    imgDescripCont: {
        flexDirection: 'row',
        height: 60,

    },
    accountInfoContainer: {
        margin: 20,
        // height: 60,
        justifyContent: 'center',
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
        fontSize: 20,
        //fontStyle: normal,
        fontWeight: '700',
        lineHeight: 18.5, /* 123.333% */
        letterSpacing: 0.5,
        marginBottom: 3,
    },
    profileSubheading: {
        color: 'white',
        //fontFamily: '',
        fontSize: 14,
        //fontStyle: normal,
        fontWeight: '400',
        lineHeight: 15, /* 123.333% */
        letterSpacing: 0,
        // wordWrap: 'break-word',
    },

})