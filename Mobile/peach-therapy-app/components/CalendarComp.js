import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getUserDetails } from '../apis/authenticationAPIs';
import { getPerson } from '../utilities/database_functions';
import { Text, View } from 'react-native';

export default function CalendarComp({ userType, appointments, idx }) {
    const [user, setUser] = useState({});
    const [doctorName, setDoctorName] = useState('');

    useEffect(() => {
        async function loadUserData() {
            const temp = await getUserDetails();
            setUser(temp);
            const doctorDetails = await getDoctorDetails(temp.profile.doctor_id);
            setDoctorName(doctorDetails.doctorName);
        }
        loadUserData();
    }, []);

    async function getDoctorDetails(uid) {
        try {
            const tempArray = await getPerson(1, uid);
            const temp = tempArray[0];
            if (temp && temp.profile && temp.profile.first_name && temp.profile.last_name && temp.profile.clinic) {
                return {
                    doctorName: temp.profile.first_name + ' ' + temp.profile.last_name,
                    clinic: temp.profile.clinic,
                };
            } else {
                return { doctorName: 'Unknown', clinic: 'Unknown' };
            }
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            return { doctorName: 'Unknown', clinic: 'Unknown' };
        }
    }

    const isPastAppointment = moment(appointments.date).isBefore(moment(), 'day');

    return (
        <View>
            <View
                style={{
                    width: 325,
                    margin: 40,
                    borderRadius: 10,
                    backgroundColor: isPastAppointment ? '#F1F5F9' : '#FDF1E4',
                    shadowColor: isPastAppointment ? 'black' : '#F08462',
                    shadowOffset: { width: 0, height: 0.5 },
                    shadowOpacity: isPastAppointment ? 0.05 : 0.2,
                    shadowRadius: 6,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        height: 24,
                        backgroundColor: isPastAppointment ? '#CBD5E1' : '#FFA386',
                        width: '100%',
                        borderRadius: 10,
                    }}>
                    <View
                        style={{
                            height: 40,
                            width: 28,
                            backgroundColor: isPastAppointment ? '#94A3B8' : '#F08462',
                            borderRadius: 10,
                            position: 'absolute',
                            left: 38,
                            top: -25,
                        }}></View>
                    <View
                        style={{
                            height: 40,
                            width: 28,
                            backgroundColor: isPastAppointment ? '#94A3B8' : '#F08462',
                            borderRadius: 10,
                            position: 'absolute',
                            right: 38,
                            top: -25,
                        }}></View>
                </View>
                <View style={{ flexDirection: 'row', height: 160, width: '100%', padding: 25, marginBottom: 15 }}>
                    <View
                        style={{
                            borderRadius: 10,
                            borderWidth: 3,
                            borderColor: isPastAppointment ? '#94A3B8' : '#FFBCA7',
                            width: 120,
                            height: 120,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 15,
                        }}>
                        <Text
                            style={{
                                color: isPastAppointment ? '#64748B' : '#F08462',
                                fontSize: 28,
                                fontWeight: '700',
                                letterSpacing: 2,
                                lineHeight: 28,
                            }}>
                            {moment(appointments.date).format('MMM').toUpperCase()}
                        </Text>
                        <Text
                            style={{
                                color: isPastAppointment ? '#B9C6D8' : '#FFC7AF',
                                fontSize: 60,
                                fontWeight: '700',
                                letterSpacing: -1,
                                lineHeight: 60,
                            }}>
                            {moment(appointments.date).format('DD')}
                        </Text>
                    </View>
                    <View style={{ width: '100%', paddingHorizontal: 20, justifyContent: 'center' }}>
                        <Text
                            style={{
                                color: isPastAppointment ? '#94A3B8' : '#F08462',
                                fontWeight: '700',

                                //fontFamily: "Montserrat",
                                fontSize: 14,
                                marginBottom: 15,
                                // width: '80%', // Adjust the width here to accommodate longer text
                                flexWrap: 'wrap', // Allow text to wrap if it exceeds the width
                            }}>
                            {isPastAppointment ? `Previous` : ''}
                            {/* {isPastAppointment ? 'Previous Appointment with' : 'Appointment with'} */}
                            {'\n'}Appointment with
                            {'\n'}Dr. {doctorName}{' '}
                            {'\n'}{isPastAppointment ? `"${appointments.note}"` : ''}
                        </Text>
                        <Text style={{ color: '#78D6D9', fontWeight: '700' }}>{moment(appointments.date_time).format('h:mm A')}</Text>

                        {!isPastAppointment && (
                            <Text style={{ color: '#F08462' }}>"{appointments.note}"</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}
