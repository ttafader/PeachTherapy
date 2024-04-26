// AuthAPI.js
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, authh } from './firebaseConfig';
import { getAuthUserAdditionalDetails, pullAllAppointmentsData, pullAllDoctorsData, pullAllPatientsData } from "./databaseAPIs";
import AsyncStorage from "@react-native-async-storage/async-storage";



// Function to handle password reset
export async function resetPassword(email) {
    try {
        await authh.sendPasswordResetEmail(email);
        return true; // Password reset email sent successfully
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false; // Error occurred while sending password reset email
    }
}

let timeoutId; // Variable to store the timeout ID

export function isUserSignedIn() {
    if (auth.currentUser) {
        console.log('logged in');
        // Clear previous timeout if exists
        clearTimeout(timeoutId);
        // Set new timeout for 5 minutes
        timeoutId = setTimeout(() => {
            // Redirect to login page after timeout
            logout(); // Optionally log out before redirecting
            navigation.replace("Login"); // Replace "Login" with the appropriate route name for your login page
            window.location.reload();

        }, 100 * 60 * 1000); // 5 minutes in milliseconds
        return true;
    } else {
        console.log('not logged in');
        return false;
    }
}



export async function getUserDetails() {
    const details = JSON.parse(await AsyncStorage.getItem("user-details"))
    return details
}

export async function signin(email, password) {
    return await signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            await getAuthUserAdditionalDetails(auth.currentUser.uid).then(async (details) => {
                const jsonAuth = JSON.stringify(auth.currentUser)
                const jsonDetails = JSON.stringify(details);
                await AsyncStorage.setItem('user-auth', jsonAuth);
                await AsyncStorage.setItem('user-details', jsonDetails);

                const patientData = await pullAllPatientsData()
                const doctorData = await pullAllDoctorsData()
                const appointmentData = await pullAllAppointmentsData()

                await AsyncStorage.setItem('temp-db-pull', JSON.stringify({
                    patientData: patientData,
                    doctorData: doctorData,
                    appointmentData: appointmentData
                }))

            })
            return 1

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error.code)
            console.log(error.message)

            if (error.code === "auth/invalid-email") {
                return -1
            } else if (error.code === "auth/invalid-credential") {
                return -2
            } else {
                return -99
            }
        });
}

export async function logout() {
    signOut(auth).then(() => {
        AsyncStorage.clear()
    }).catch((error) => {
        console.log('could not log out ', e)
    });
}
