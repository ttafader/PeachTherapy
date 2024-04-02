import React, { useEffect, useState } from 'react'
import { PieChart, ProgressCircle, BarChart, Grid, LineChart } from 'react-native-svg-charts'
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable, ScrollView, RefreshControl } from 'react-native';
import { Rect } from 'react-native-svg';
import { isUserSignedIn, getUserDetails } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
//for conditionals
import PatientNavComp from '../components/PatientNavComp';
import ClinicianNavComp from '../components/ClinicianNavComp';
import BackButton from '../components/BackButton';

export default function DonutChart({ navigation }) {
    //for conditionals
    const [user, setUser] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [recordings, setRecordings] = useState(null);
    const [confidenceValues, setConfidenceValues] = useState([]);
    const [movingAverageValues, setMovingAverageValues] = useState([]);

    useEffect(() => {
        if (!isUserSignedIn()) navigation.replace("Login");
        async function loadUserData() {
            const dets = await getUserDetails();
            setRecordings(dets['recordings']);
        }
        loadUserData();
    }, []);

    const loadUserData = async () => {
        setUser(await getUserDetails());
    }

    const handleRefresh = async () => {
        console.log('Refreshing...');
        setRefreshing(true);
        await loadUserData();
        setRefreshing(false);
        console.log('Refreshed!');
    }

    useEffect(() => {
        return () => {
            setRefreshing(false); // Reset refreshing state on unmount
        };
    }, []);

    useEffect(() => {
        if (recordings && Object.keys(recordings).length > 0) {
            const values = Object.values(recordings).map(rec => parseFloat(rec.confidence));
            console.log(values);
            setConfidenceValues(values.slice(0, 10)); // Limit to maximum 10 values

            const movingAverages = calculateMovingAverages(values.slice(0, 10)); // Calculate moving averages based on the first 10 values
            setMovingAverageValues(movingAverages);
        }
    }, [recordings]);


    const invertedConfidenceValues = confidenceValues.map(value => 100 - value);





    const averageComplementConfidence = () => {
        if (recordings && Object.keys(recordings).length > 0) {
            // Get the last three recordings
            const lastThreeRecordings = Object.values(recordings).slice(-3);
            // Calculate the complements and get their average
            const complements = lastThreeRecordings.map(rec => 100 - rec.confidence);
            const totalComplement = complements.reduce((acc, val) => acc + val, 0);
            return totalComplement / complements.length;
        } else {
            return 0; // Return 0 if there are no recordings or if recordings is null
        }
    };
    const calculateMovingAverages = (values) => {
        const invertedValues = values.map(value => 100 - value); // Invert the values
        console.log(invertedValues);

        const movingAverages = [0];
        for (let i = 1; i < invertedValues.length; i++) {
            const window = invertedValues.slice(0, i);
            const average = window.reduce((sum, value) => sum + value, 0) / window.length;

            movingAverages.push(average);
        }
        console.log(movingAverages);
        return movingAverages;
    };

    const getStatusColor = (confidence) => {
        if (confidence < 35) {
            return '#f87070'; // Red color
        } else if (confidence >= 35 && confidence <= 70) {
            return '#ffeda3'; // Yellow color
        } else {
            return '#A0E480'; // Green color
        }
    };

    const getStatusLabel = (confidence) => {
        if (confidence < 35) {
            return "There is room for improvement";
        } else if (confidence >= 35 && confidence <= 70) {
            return "You're improving a lot!";
        } else {
            return "Keep up the good work!";
        }
    };

    return (<>
        <ScrollView style={{ flex: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#0000ff']}
                />
            }
        >
            <View style={styles.navBar}>

                <PatientNavComp navigation={navigation} colorBG={'#FFA386'} />
            </View>

            <ProfileHeader colorBG={'#FFA386'} />
            <BackButton navigation={navigation} colorBG={'#FFA386'}></BackButton>
            {/* ctrl click to see components insides */}
            <View style={{ justifyContent: 'center', position: 'relative', marginTop: 30 }}>
                {recordings && Object.keys(recordings).length > 0 ? (
                    // Render ProgressCircle with average complement confidence
                    <ProgressCircle
                        style={{ height: 350, position: 'relative', zIndex: 1 }}
                        strokeWidth={20}
                        progress={averageComplementConfidence() * 0.01} // Scale progress to fit between 0 and 1
                        progressColor={getStatusColor(averageComplementConfidence())}
                        backgroundColor={'#E2E8F0'}
                    />
                ) : (
                    <Text style={styles.noRecordings}>No data{'\n'}available at this time</Text>
                )}
                <Text style={{ left: '20%', textAlign: 'center', width: '60%', ...styles.bigPercent, color: '#FFA386' }}>
                    {Math.floor(averageComplementConfidence())}%
                    <Text style={{ fontSize: 12, color: '#FFA386', textAlign: 'center' }}>
                        {'\n'}{getStatusLabel(averageComplementConfidence())} This graph shows your overall most current score.
                    </Text>
                </Text>
            </View>


            <View style={{ backgroundColor: '#FFA386', padding: 10, marginTop: 50, marginHorizontal: 30, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <Text style={{ color: 'white', fontWeight: '700', paddingHorizontal: 10, paddingTop: 10 }}>
                    Here is your Progress Report
                </Text>
                <Text style={{ color: 'white', fontWeight: '500', paddingHorizontal: 10, paddingTop: 10 }}>
                    Here is a cumulation of your progress this far. Reload Page to see new Data.
                </Text>
            </View>


            <View style={{ position: 'relative' }}>
                <BarChart
                    style={{ height: 200, paddingHorizontal: 20, marginBottom: 50, marginHorizontal: 30, backgroundColor: '#FFA386', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                    data={invertedConfidenceValues} // Use inverted values
                    svg={{ fill: 'white' }}
                    contentInset={{ top: 30, bottom: 30 }}

                >
                    {/* <Text>{invertedConfidenceValues.map(value => value)}</Text> */}
                    <Grid />
                </BarChart>
                <LineChart
                    style={{ position: 'absolute', top: "22%", left: "11%", right: 0, bottom: 0, width: 350, height: 150 }}
                    data={movingAverageValues.map(value => value * 0.01)} // Multiply each value by 0.01
                    svg={{ stroke: '#FFC1AD', strokeWidth: 2 }}
                    contentInset={{ top: 30, bottom: 30 }}
                >
                </LineChart>
            </View>

        </ScrollView >


    </>
    )
}


const styles = StyleSheet.create({

    wholePage: {
        flex: 1,
    },
    bigPercent: {
        // position: 'absolute',
        fontSize: 100,
        fontWeight: '700',
        color: '#FFA386',
        alignItems: 'center',
        justifyContent: 'center',
        //left: '30%',
        //top: '30%',
        position: 'absolute',
        zIndex: 2,
    },
    navBar: {
        height: 120,
        backgroundColor: '#FFA386',
        // paddingHorizontal: 15,
    },
    icon: {
        width: 25,
        height: 25,
        margin: 20,
        resizeMode: 'contain',

    },
    container: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        flexDirection: 'row',
        backgroundColor: '#FFA386',
    },
    pageContainer: {
        flex: 1,
        marginVertical: 50,
        height: 'center',
        alignItems: 'center',
        justifyContent: '',
        //backgroundColor: '#c9c9c9',
    },
    navSelect: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    accountInfo: {
        //flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        padding: 10,
        height: 100,
        backgroundColor: '#FFA386',
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
    buttonContainer: {

        height: '60%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'black',

        //elevation: 3,

    },

    title: {
        color: '#78D6D9',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        letterSpacing: 1,
        textAlign: 'center',

    },
    body: {
        color: '#FFA386',
    },
    warning: {
        color: '#FFA386',
        fontWeight: '700',
        marginTop: 40,
        marginBottom: 20,
        textAlign: 'center',
        width: '70%',
    },

    newNotif: {
        alignItems: 'center',
        justifyContent: 'center',
        // height: '50%',
        width: '100%',
        borderTopWidth: 8,
        borderBottomWidth: 8,
        borderColor: '#FDF1E4',
        paddingHorizontal: 30,
        paddingVertical: 50,


    },
    oldNotif: {
        alignItems: 'center',
        justifyContent: 'center',
        // height: '50%',
        width: '100%',
        paddingHorizontal: 30,
        paddingVertical: 50,


    },
    accentButtonText: {
        // Login
        color: '#FFD0BA',
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: 1,
        // wordWrap: 'break-word',
        textAlign: 'left',
        marginBottom: 40,
        opacity: '40%',

    },



});