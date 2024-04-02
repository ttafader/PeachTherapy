import React from 'react';
import { View, Text, Image } from 'react-native';

export default function PatientDetailsScreen({ route }) {
    // Access the passed patientDetails from route.params
    const { patientDetails } = route.params;

    return (
        <View>
            <Text>Patient Name: {patientDetails.patientName}</Text>
            <Image source={{ uri: patientDetails.imageDisplay }} style={{ width: 100, height: 100 }} />
            <Text>Birth Date: {patientDetails.birthDate}</Text>
            {/* Display other details as needed */}
        </View>
    );
}
