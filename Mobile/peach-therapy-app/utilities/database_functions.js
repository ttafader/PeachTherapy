import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getMyAppointments() {
    let myAppointments = []

    const me = JSON.parse(await AsyncStorage.getItem('user-details'))
    const pull = JSON.parse(await AsyncStorage.getItem("temp-db-pull"))

    //troubleshooting
    // console.log("Value of 'me':", me);
    // if (me && me.profile) {
    //     console.log("Value of 'user_id':", me.profile.user_id);
    // } else {
    //     console.log("Either 'me' or 'me.profile' is undefined");
    // }

    // console.log("testing here:", me.profile.patient_id || me.profile.doctor_id);

    myAppointments = Object.values(pull['appointmentData']).filter(
        appt => appt['patient_id'] == me.profile.patient_id
            || appt['doctor_id'] == me.profile.doctor_id
            || appt['doctor_id'] == me.profile.user_id
            || appt['patient_id'] == me.profile.user_id)

    return myAppointments
}
export async function getMyPatients() {
    try {
        let myPatients = [];

        const me = JSON.parse(await AsyncStorage.getItem('user-details'));
        const pull = JSON.parse(await AsyncStorage.getItem("temp-db-pull"));

        if (!me || !me.profile || !pull || !pull['patientData']) {
            throw new Error("Invalid user details or data structure in pull.");
        }

        if (me.profile.user_type === 1) {
            myPatients = Object.values(pull['patientData']).filter(
                pat => pat.profile.doctor_id === me.profile.user_id
            );
        }

        // console.log("My Patients:", myPatients);
        return myPatients;
    } catch (error) {
        console.error("Error in getMyPatients:", error);
        throw error;
    }
}

export async function getPerson(type, idType, uid) {
    // console.log("uid:", uid);
    try {
        let data = "doctorData";
        if (type === 2) {
            data = "patientData";
        }
        // console.log("Data:", data);

        const pull = JSON.parse(await AsyncStorage.getItem("temp-db-pull"));
        if (!pull || !pull[data]) {
            throw new Error("Invalid data structure in pull or data not found.");
        }

        // console.log("pull[data]:", pull[data]);
        // console.log("idType:", idType);

        const person = Object.values(pull[data]).filter(doc => {
            const idToMatch = idType === 'user_id' ? doc.profile.doctor_id : doc.profile.patient_id;
            return idToMatch === uid;
        });
        // console.log("person:", person);



        if (person.length === 0) {
            console.log("getPerson function cant find a person, Check database_functions");
        } else {
            // console.log("Person:", person);
        }

        return person;
    } catch (error) {
        console.error("Error in getPerson:", error);
        throw error;
    }
}
