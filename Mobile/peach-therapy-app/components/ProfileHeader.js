import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { getUserDetails } from '../apis/authenticationAPIs'
import { getPerson } from '../utilities/database_functions'

export default function ProfileHeader({ colorBG }) {
    const [user, setUser] = useState([])

    const [doctorName, setDoctorName] = useState("")

    // const [clinic, setClinic] = useState("") // Define clinic state

    useEffect(() => {
        async function loadUserData() {
            const temp = await getUserDetails()
            setUser(await getUserDetails())
            getDoctorName(temp.profile.doctor_id)

        }
        loadUserData()


    }, [])

    useEffect(() => {
        async function loadUserData() {
            const temp = await getUserDetails();
            // const temp = user;
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
            console.log(uid)
            if (temp && temp.profile && temp.profile.first_name && temp.profile.last_name) {
                return {
                    doctorName: temp.profile.first_name + " " + temp.profile.last_name,
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
        const temp = await getPerson(1, uid)
        // console.log(uid)
        await setDoctorName(temp.profile.first_name + " " + temp.profile.last_name)

    }


    return user.profile && (
        <View style={[styles.accountInfo, { backgroundColor: colorBG }]}>
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
        borderRadius: 30,
        marginHorizontal: 5,
        marginTop: 5,
        padding: 25,
        height: 110,
        // backgroundColor: '#24A8AC',
        // backgroundColor: '#FFA386',
        // justifyContent: 'center',
        // alignItems: 'center',

        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    accountInfoContainer: {
        margin: 20,
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
        //fontFamily: "Montserrat",
        fontSize: 14,
        //fontStyle: normal,
        fontWeight: '400',
        lineHeight: 15, /* 123.333% */
        letterSpacing: 0,
        // wordWrap: 'break-word',
    },

})