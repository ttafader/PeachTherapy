import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getMyAppointments() {
    let myAppointments = []

    const me = JSON.parse(await AsyncStorage.getItem('user-details'))
    const pull = JSON.parse(await AsyncStorage.getItem("temp-db-pull"))

    myAppointments = Object.values(pull['appointmentData']).filter(
        appt => appt['patient_id'] == me.profile.user_id
            || appt['doctor_id'] == me.profile.user_id)

    return myAppointments
}

export async function getMyPatients() {
    let myPatients = []

    const me = JSON.parse(await AsyncStorage.getItem('user-details'))
    const pull = JSON.parse(await AsyncStorage.getItem("temp-db-pull"))

    if (me.profile.user_type === 1) {
        myPatients = Object.values(pull['patientData']).filter(
            pat => pat['profile']['doctor_id'] == me.profile.user_id
        )
    } else {
        myPatients = []
    }

    return myPatients
}

export async function getPerson(type, uid) {
    console.log(uid)
    console.log(type)
    let data = "doctorData"
    if (type === 1) {
        data = "doctorData"
    } else if (type === 2) {
        data = "patientData"
    }

    const pull = JSON.parse(await AsyncStorage.getItem("temp-db-pull"))
    const person = Object.values(pull[data]).filter(
        pat => pat['profile']['user_id'] == uid
    )

    return person
}