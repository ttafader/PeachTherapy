import { getDatabase, ref, get, child } from "firebase/database";

import { database } from "./firebaseConfig";

const dbRef = ref(database);

export async function pullAllDoctorsData() {
    let doctors = {}

    doctors = await get(child(dbRef, `doctors/`)).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val()
        } else {
            return {}
        }
    }).catch((error) => {
        console.error(error);
        return {}
    })

    return doctors
}

export async function pullAllAppointmentsData() {
    let appointments = {}

    appointments = await get(child(dbRef, `appointments/`)).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val()
        } else {
            return {}
        }
    }).catch((error) => {
        console.error(error);
        return {}
    })

    return appointments
}

export async function pullAllPatientsData() {
    let patients = {}

    patients = await get(child(dbRef, `patients/`)).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val()
        } else {
            return {}
        }
    }).catch((error) => {
        console.error(error);
        return {}
    })
    console.log("hello")
    return patients
}

export async function getAuthUserAdditionalDetails(uid) {
    user = await get(child(dbRef, `patients/${uid}`)).then(async (snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val()
        } else {
            return await get(child(dbRef, `doctors/${uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    return snapshot.val()
                } else {
                    console.log('Database Error')
                    return {}
                }
            }).catch((error) => {
                console.error(error);
                return {}
            })
        }
    }).catch((error) => {
        console.error(error);
        return {}
    })
    return user
}



// Audio Information
// Clinician Information
