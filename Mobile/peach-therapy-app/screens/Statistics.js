// import React, { useEffect, useState } from 'react'
// import NavButton from '../components/NavigationButton'
// import { Text, Pressable, View, StyleSheet } from 'react-native'
// import { Audio } from 'expo-av';

// import { getAllDoctorsData, getAllPatientsData } from "../apis/databaseAPIs";
// import { isUserSignedIn } from '../apis/authenticationAPIs';

// export default function Statistics({ navigation }) {
//     const [doctors, setDoctors] = useState({})
//     const [patients, setPatients] = useState({})

//     useEffect(() => {
//         if (!isUserSignedIn()) navigation.replace("Login")
//     })

//     useEffect(() => {
//         getData()
//     }, [])

//     async function getData() {
//         setPatients(await getAllPatientsData())
//     }

//     return (
//         <View style={{ justifyContent: "center", display: "flex", flexDirection: "column", flexWrap: "wrap", gap: 10 }}>
//             {
//                 Object.keys(patients).map((patient_id) => {
//                     return (
//                         <View style={{}} >
//                             <Text>First Name: {patients[patient_id].first_name}</Text>
//                             <Text>Last Name: {patients[patient_id].last_name}</Text>
//                             <Text>Birthdate: {patients[patient_id].birthdate}</Text>
//                             <Text>Patient ID: {patients[patient_id].patient_id}</Text>
//                             <Text>Doctor ID: {patients[patient_id].doctor_id}</Text>
//                             <Text>Age: {patients[patient_id].age}</Text>
//                             <Text>Health Card Number: {patients[patient_id].health_card_number}</Text>
//                             <Text>Gender: {patients[patient_id].gender}</Text>
//                         </View>
//                     )
//                 })
//             }

//             <Pressable>
//                 <Text style={styles.forgotPassword} onPress={() => getData()}>Refresh</Text>
//             </Pressable>
//         </View >
//     )
// }
// const styles = StyleSheet.create({
//     button: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 12,
//         paddingHorizontal: 32,
//         elevation: 3,
//         width: '50%',

//         backgroundColor: 'white',
//         borderRadius: 10,
//         borderColor: '#FFA386',
//         borderWidth: 2,

//     },
//     errorMessage: {
//         justifyContent: "center",
//         textAlign: "center",
//         color: '#DC1A00',
//         width: '70%',
//         fontWeight: '700',
//         marginTop: -10,
//         marginBottom: 40,
//     },
//     text: {
//         // Login
//         color: '#FFA386',
//         fontSize: 18,
//         fontWeight: '500',
//         lineHeight: 24,
//         letterSpacing: 1.26,
//         // wordWrap: 'break-word',
//     },

//     title: {
//         color: '#FFA386',
//         fontSize: 33,
//         fontWeight: '700',
//         textTransform: 'capitalize',
//         lineHeight: 33,
//         letterSpacing: 0.66,
//         // wordWrap: 'break-word',
//         marginTop: -60,
//         textAlign: 'center',
//     },

//     placeholderCaptions: {
//         justifyContent: "left",
//         color: '#FF5929',
//         width: '70%',
//         fontWeight: '500',
//         marginTop: -10,
//         marginBottom: 5,
//     },

//     forgotPassword: {

//         // Login
//         color: '#FFA386',
//         fontSize: 16,
//         //fontWeight: '500',
//         lineHeight: 24,
//         letterSpacing: 1.26,
//         // wordWrap: 'break-word',
//         textDecorationLine: 'underline',
//         marginBottom: 100,
//         marginTop: 20,
//     },

//     writingInput: {

//         height: 40,
//         borderRadius: 10,
//         backgroundColor: '#FED6D0',
//         /* baby shadow */
//         paddingRight: 20,
//         paddingLeft: 20,
//         marginBottom: 20,
//         width: '70%'

//     },


//     container: {
//         flex: 1,
//         backgroundColor: '#FFF6F4',
//         justifyContent: "flex-end",
//         alignItems: "center",
//     },
//     logo: {
//         width: 200,
//         height: 200,
//         marginBottom: 20,
//     },
//     titleAndLogo: {
//         flex: 1,
//         //top: 70,
//         justifyContent: "center",
//         alignItems: "center",
//     },


//     placeholderText: {
//         opacity: '38%',
//         color: '#DC1A00',
//         fontSize: 13,
//         letterSpacing: 2,
//         fontWeight: '400',
//         lineHeight: 18.5, /* 142.308% */
//         letterSpacing: 0.585,
//     }

// });
