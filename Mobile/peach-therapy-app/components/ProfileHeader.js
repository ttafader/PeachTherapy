import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { getUserDetails } from '../apis/authenticationAPIs'
import { getPerson } from '../utilities/database_functions'

export default function ProfileHeader({ }) {
    const [user, setUser] = useState({})
    const [doctorName, setDoctorName] = useState("")
    const [clinic, setClinic] = useState("") // Define clinic state

    // useEffect(() => {
    //     async function loadUserData() {
    //         const temp = await getUserDetails()
    //         await setUser(await getUserDetails())
    //         await getDoctorName(temp.profile.doctor_id)
    //         console.log(first)
    //     }
    //     loadUserData()


    // }, [])

    useEffect(() => {
        async function loadUserData() {
            const temp = await getUserDetails();
            setUser(temp);
            const doctorDetails = await getDoctorDetails(temp.profile.doctor_id);
            // console.log("Doctor Details:", doctorDetails);
            setDoctorName(doctorDetails.doctorName);
            setClinic(doctorDetails.clinic);
        }
        loadUserData();
    }, []);

    async function getDoctorDetails(uid) {
        try {
            const tempArray = await getPerson(1, uid);
            const temp = tempArray[0]; // Access the first element of the array
            // console.log("Doctor Temp:", temp);
            if (temp && temp.profile && temp.profile.first_name && temp.profile.last_name && temp.profile.clinic) {
                return {
                    doctorName: temp.profile.first_name + " " + temp.profile.last_name,
                    clinic: temp.profile.clinic
                };
            } else {
                return { doctorName: "Unknown", clinic: "Unknown" };
            }
        } catch (error) {
            // console.error("Error fetching doctor details:", error);
            return { doctorName: "Unknown", clinic: "Unknown" };
        }
    }


    // async function getDoctorName(uid) {
    //     const temp = await getPerson(1, uid)
    //     // console.log(uid)
    //     await setDoctorName(temp.profile.first_name + " " + temp.profile.last_name)

    // }


    return user.profile && (
        <View style={styles.accountInfo}>
            <Image src={user.profile.img_url} style={styles.profilePic} />
            <View style={styles.accountInfoContainer}>
                <Text style={styles.profileDescription}>{user.profile.first_name} {user.profile.last_name}</Text>
                {
                    user?.profile?.user_type === 2 && (
                        <Text style={styles.profileSubheading}>
                            Patient with Dr. {doctorName}
                            {/* {clinic} */}
                        </Text>
                    )
                }
                {
                    user?.profile?.user_type === 1 && (
                        <Text style={styles.profileSubheading}>
                            Speech Specialist at {user.profile.clinic}
                            {/* {clinic} */}
                        </Text>
                    )
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    accountInfo: {
        //flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        padding: 10,
        height: 100,
        backgroundColor: '#24A8AC',
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
        color: 'white',
        //font-family: Montserrat,
        fontSize: 18,
        //fontStyle: normal,
        fontWeight: '700',
        lineHeight: 18.5, /* 123.333% */
        letterSpacing: 0.5,
    },
    profileSubheading: {
        color: 'white',
        //fontFamily: '',
        fontSize: 14,
        //fontStyle: normal,
        fontWeight: '300',
        lineHeight: 15, /* 123.333% */
        letterSpacing: 0,
        // wordWrap: 'break-word',
    },

})