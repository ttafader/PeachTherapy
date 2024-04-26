import React, { useEffect, useState } from 'react'
import { PieChart, ProgressCircle, BarChart, Grid, LineChart, YAxis, XAxis } from 'react-native-svg-charts'
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Rect } from 'react-native-svg';
import { isUserSignedIn, getUserDetails } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';
//for conditionals
import PatientNavComp from '../components/PatientNavComp';
import ClinicianNavComp from '../components/ClinicianNavComp';
import BackButton from '../components/BackButton';
import ClinicianHeader from '../components/ClinicianHeader';
import { getImageURLFromStorage } from '../apis/storageAPIs';

export default function Chart({ navigation, route }) {

    const { patientObject } = route.params
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    //for conditionals
    const [refreshing, setRefreshing] = useState(false);
    const [mlModel, setMLModel] = useState(null);
    const [recordings, setRecordings] = useState(null);
    const [confidenceValues, setConfidenceValues] = useState([]);
    const [movingAverageValues, setMovingAverageValues] = useState([]);
    const [form1, setForm1] = useState([]);
    const [form2, setForm2] = useState([]);
    const [mfccmean, setMfccMean] = useState([]);
    const [mfccvar, setMfccVar] = useState([]);
    const [pitchp, setPitchP] = useState([]);

    // Ensure that the useEffect hook for loading user data properly sets the user state and handles loading state.
    useEffect(() => {
        async function loadUserData() {
            try {
                const userDetails = await getUserDetails();
                setUser(userDetails);
                setLoading(false);
            } catch (error) {
                console.error("Error loading user data:", error);
                setLoading(false); // Make sure to handle errors and set loading state accordingly
            }
        }
        loadUserData();
    }, []);

    // Ensure that the useEffect hook for loading additional data properly sets state and handles loading state.
    // useEffect(() => {
    //     if (!isUserSignedIn()) {
    //         navigation.replace("Login");
    //     } else {
    //         async function loadAdditionalData() {
    //             try {
    //                 setRecordings(patientObject.recordings);
    //                 // set the MLmodel to to the following
    //                 // profile.ml_boundaries_plot
    //                 setMLmodel("../assets/mlexample.png"); 
    //                 setLoading(false); 
    //             } catch (error) {
    //                 console.error("Error loading additional data:", error);
    //                 setLoading(false); 
    //             }
    //         }
    //         loadAdditionalData();
    //     }
    // }, [navigation, patientObject]);

    //one above is the code that sets the ml model to an asset image
    //code below is me trying to call on the cloud bucket one

    useEffect(() => {
        if (!isUserSignedIn()) {
            navigation.replace("Login");
        } else {
            async function loadAdditionalData() {
                try {
                    setRecordings(patientObject.recordings);
                    const mlModelURL = await getImageURLFromStorage(patientObject.profile.ml_boundaries_plot);
                    setMLModel(mlModelURL);
                    setLoading(false);
                } catch (error) {
                    console.error("Error loading additional data:", error);
                    setLoading(false);
                }
            }
            loadAdditionalData();
        }
    }, [navigation, patientObject]);

    // Ensure that the handleRefresh function properly updates state and handles refreshing state.
    const handleRefresh = async () => {
        console.log('Refreshing...');
        try {
            setLoading(true); // Set loading state to true when refreshing
            await loadUserData();
            await loadAdditionalData();
            console.log('Refreshed!');
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setLoading(false); // Always set loading state to false after refreshing
            setRefreshing(false);
        }
    };


    useEffect(() => {
        return () => {
            setRefreshing(false); // Reset refreshing state on unmount
        };
    }, []);

    useEffect(() => {
        if (recordings && Object.keys(recordings).length > 0) {
            const values = Object.values(recordings).map(rec => parseFloat(rec.confidence));
            setForm1(Object.values(recordings).map(rec => parseFloat(rec.features.formant1)))
            setForm2(Object.values(recordings).map(rec => parseFloat(rec.features.formant2)))
            setMfccMean(Object.values(recordings).map(rec => parseFloat(rec.features.mfcc_mean)))
            setMfccVar(Object.values(recordings).map(rec => parseFloat(rec.features.mfcc_var)))
            setPitchP(Object.values(recordings).map(rec => parseFloat(rec.features.pitch_period)))

            // console.log(values);
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

    return loading ? (
        <ScrollView>
            <SafeAreaView>
                <SafeAreaView style={{
                    height: 80,
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    backgroundColor: '#FFA386',
                }}>
                    <ActivityIndicator size={'small'} color={'#FFFFFF'} />
                </SafeAreaView>
            </SafeAreaView>
        </ScrollView>
    ) : (
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

                {user?.profile?.user_type === 1 && <ClinicianNavComp navigation={navigation} colorBG={'#FFA386'} />}
                {user?.profile?.user_type === 2 && <PatientNavComp navigation={navigation} colorBG={'#FFA386'} />}

            </View>

            <BackButton navigation={navigation} colorBG={'#FFA386'}></BackButton>
            <ProfileHeader colorBG={'#FFA386'} />
            {user?.profile?.user_type === 1 && <ClinicianHeader colorBG={'#24A8AC'} patientObject={patientObject} />}

            <View style={styles.chartInfo}>
                <View style={{ justifyContent: 'center', position: 'relative', }}>
                    {recordings && Object.keys(recordings).length > 0 ? (
                        // Render ProgressCircle with average complement confidence
                        <ProgressCircle
                            style={{ height: 350, position: 'relative', zIndex: 1, marginBottom: 40 }}
                            strokeWidth={25}
                            progress={averageComplementConfidence() * 0.01} // Scale progress to fit between 0 and 1
                            progressColor={getStatusColor(averageComplementConfidence())}
                            backgroundColor={'#E2E8F0'}
                        />
                    ) : (
                        <Text style={styles.noRecordings}>No data{'\n'}available at this time</Text>
                    )}
                    <Text style={{ top: '20%', left: '20%', textAlign: 'center', width: '60%', ...styles.bigPercent, color: '#DB7B5B' }}>
                        {Math.floor(averageComplementConfidence())}%
                        <Text style={{
                            //fontFamily: "Montserrat",
                            fontSize: 14, color: '#F08E6F', textAlign: 'center'
                        }}>
                            {'\n'}{getStatusLabel(averageComplementConfidence())}{'\n'}This graph shows your overall most current score.
                        </Text>
                    </Text>
                </View>
                <View style={{ backgroundColor: 'white', shadowColor: '#895C5B', margin: 10, padding: 20, borderRadius: 20 }}>

                    <Text style={styles.noRecordings}>Recordings ML Features Model</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, width: '100%', borderRadius: 10, backgroundColor: '#FFB59E', height: 247, }}>
                        <Image source={{ uri: mlModel }} style={styles.mlmodel} />
                    </View>
                </View>

                <Text style={styles.noRecordings}>
                    Here is your Progress Report
                </Text>
                <View style={{ backgroundColor: '#FFA386', padding: 10, marginTop: 30, marginHorizontal: 30, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <Text style={{
                        color: 'white', fontWeight: '500', paddingHorizontal: 10, paddingTop: 10
                    }}>
                        Here is a cumulation of your progress this far.Reload Page to see new Data.
                    </Text>
                </View>
                <View style={{ height: 250, flexDirection: 'row', backgroundColor: '#FFA386', padding: 25, marginHorizontal: 30, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <YAxis
                        data={invertedConfidenceValues} // Use inverted values
                        svg={{
                            fontSize: 10, fill: 'white', fontWeight: '600'
                        }}
                        numberOfTicks={10}
                        formatLabel={(value, index) => index === 0 ? '' : `${value.toFixed(0)}%`} // Customize format for y-axis labels
                        min={0} // Set the minimum value of the y-axis to 0
                        style={{ marginBottom: 15 }} // Adjust style to create space for x-axis labels
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <BarChart
                            style={{ flex: 1 }}
                            data={invertedConfidenceValues} // Use inverted values
                            svg={{ fill: 'white' }}
                            contentInset={{ top: 15, bottom: 40 }}
                        >
                            <Grid />
                        </BarChart>
                        <XAxis
                            data={invertedConfidenceValues} // Use inverted values
                            formatLabel={(value, index) => (index + 1).toString()} // Display index number
                            contentInset={{ left: 10, right: 10 }} // Adjust content inset for better visibility
                            svg={{
                                fontSize: 10, fill: 'white', fontWeight: '600'
                            }} // Style the x-axis labels with white color and font weight 500
                            style={{ paddingTop: 10, marginHorizontal: 10 }} // Adjust style to align labels properly
                        />
                    </View>
                    <LineChart
                        style={{ position: 'absolute', top: "17%", left: "20%", width: 257, height: 200 }}
                        data={movingAverageValues.map(value => value * 0.01)} // Multiply each value by 0.01
                        svg={{ stroke: '#FFC1AD', strokeWidth: 2 }}
                        contentInset={{ top: 30, bottom: 30 }}
                    >
                    </LineChart>
                </View>

                <View style={styles.featurescontainer}>
                    <View style={{ backgroundColor: 'white', marginBottom: -30, padding: 20, marginHorizontal: 30, borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
                        <Text style={styles.featuresvaluestitle}>Formant 1: {'\n'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', height: 250, backgroundColor: 'white', padding: 20, marginHorizontal: 30, }}>
                        <YAxis

                            data={form1} // Use inverted values
                            svg={{
                                fontSize: 10, fill: '#895C5B', fontWeight: '600'
                            }}
                            numberOfTicks={10} // Adjust the number of ticks as needed
                            formatLabel={(value, index) => index + 1 === 0 ? '' : `${value.toFixed(0)}`} // Customize format for y-axis labels
                            min={0} // Set the minimum value of the y-axis to 0
                            max={3500} // Set the maximum value of the y-axis to 3500
                            style={{ marginBottom: 5 }} // Adjust style to create space for x-axis labels
                            contentInset={{ top: 10, bottom: 10 }} // Adjust content inset for better visibility

                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <BarChart
                                style={{ flex: 1 }}
                                data={form1} // Use inverted values
                                svg={{ fill: '#79D5D8' }}
                                contentInset={{ top: 15, bottom: 10 }}
                            >
                                <Grid />
                            </BarChart>
                            <XAxis
                                data={form1} // Use inverted values
                                formatLabel={(value, index) => (index + 1).toString()} // Display index number
                                contentInset={{ left: 10, right: 10 }} // Adjust content inset for better visibility
                                svg={{
                                    fontSize: 10, fill: '#895C5B', fontWeight: '600'
                                }} // Style the x-axis labels with white color and font weight 500
                                style={{ paddingTop: 10, marginHorizontal: 10 }} // Adjust style to align labels properly
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 30, marginBottom: 20, borderBottomRightRadius: 20, backgroundColor: 'white', borderBottomLeftRadius: 20 }}>
                        <Text style={styles.featuresvalues}>
                            Formant 1 is the lowest resonance frequency in the vocal tract during speech. {'\n\n'} It's essential in speech pathology because deviations may signal vocal tract issues like constriction or enlargement. Abnormal values may indicate problems in vocal tract size or shape.
                            {'\n\n'}Your Recording Values: {form1 && form1.length > 0 ? '\n\n' + form1.map(val => parseFloat(val).toFixed(2)).join(', \n') : 'No formant 1'}
                        </Text>
                    </View>


                    <View style={{ backgroundColor: 'white', marginBottom: -30, padding: 20, marginHorizontal: 30, borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
                        <Text style={styles.featuresvaluestitle}>Formant 2: {'\n'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', height: 250, backgroundColor: 'white', padding: 20, marginHorizontal: 30, }}>
                        <YAxis

                            data={form2} // Use inverted values
                            svg={{
                                fontSize: 10, fill: '#895C5B', fontWeight: '600'
                            }}
                            numberOfTicks={10} // Adjust the number of ticks as needed
                            formatLabel={(value, index) => index + 1 === 0 ? '' : `${value.toFixed(0)}`} // Customize format for y-axis labels
                            min={0} // Set the minimum value of the y-axis to 0
                            max={8000} // Set the maximum value of the y-axis to 3500
                            style={{ marginBottom: 5 }} // Adjust style to create space for x-axis labels
                            contentInset={{ top: 10, bottom: 10 }} // Adjust content inset for better visibility

                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <BarChart
                                style={{ flex: 1 }}
                                data={form2} // Use inverted values
                                svg={{ fill: '#79D5D8' }}
                                contentInset={{ top: 15, bottom: 10 }}
                            >
                                <Grid />
                            </BarChart>
                            <XAxis
                                data={form2} // Use inverted values
                                formatLabel={(value, index) => (index + 1).toString()} // Display index number
                                contentInset={{ left: 10, right: 10 }} // Adjust content inset for better visibility
                                svg={{
                                    fontSize: 10, fill: '#895C5B', fontWeight: '600'
                                }} // Style the x-axis labels with white color and font weight 500
                                style={{ paddingTop: 10, marginHorizontal: 10 }} // Adjust style to align labels properly
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 30, marginBottom: 20, borderBottomRightRadius: 20, backgroundColor: 'white', borderBottomLeftRadius: 20 }}>

                        <Text style={styles.featuresvalues}>
                            Formant 2, the second lowest resonance frequency in speech production, reflects vocal tract configuration. Deviations from normal Formant 2 values can highlight speech articulation problems, like vowel distortions or nasality. Analyzing Formant 2 aids in diagnosing conditions affecting speech clarity or resonance.
                            {'\n\n'}Your Recording Values:{'\n\n'}{form2 && form2.length > 0 ? '\n' + form2.map(val => parseFloat(val).toFixed(2)).join(', \n') : 'No formant 2'}
                        </Text>
                    </View>
                    <View style={{ backgroundColor: 'white', marginBottom: -30, padding: 20, marginHorizontal: 30, borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
                        <Text style={styles.featuresvaluestitle}>MFCC Mean: {'\n'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', height: 250, backgroundColor: 'white', padding: 20, marginHorizontal: 30, }}>
                        <YAxis

                            data={mfccmean} // Use inverted values
                            svg={{
                                fontSize: 10, fill: '#895C5B', fontWeight: '600'
                            }}
                            numberOfTicks={10} // Adjust the number of ticks as needed
                            formatLabel={(value, index) => index + 1 === 0 ? '' : `${value.toFixed(0)}`} // Customize format for y-axis labels
                            min={-20} // Set the minimum value of the y-axis to 0
                            max={0} // Set the maximum value of the y-axis to 3500
                            style={{ marginBottom: 5 }} // Adjust style to create space for x-axis labels
                            contentInset={{ top: 10, bottom: 10 }} // Adjust content inset for better visibility

                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <BarChart
                                style={{ flex: 1 }}
                                data={mfccmean} // Use inverted values
                                svg={{ fill: '#79D5D8' }}
                                contentInset={{ top: 15, bottom: 10 }}
                            >
                                <Grid />
                            </BarChart>
                            <XAxis
                                data={mfccmean} // Use inverted values
                                formatLabel={(value, index) => (index + 1).toString()} // Display index number
                                contentInset={{ left: 10, right: 10 }} // Adjust content inset for better visibility
                                svg={{
                                    fontSize: 10, fill: '#895C5B', fontWeight: '600'
                                }} // Style the x-axis labels with white color and font weight 500
                                style={{ paddingTop: 10, marginHorizontal: 10 }} // Adjust style to align labels properly
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 30, marginBottom: 20, borderBottomRightRadius: 20, backgroundColor: 'white', borderBottomLeftRadius: 20 }}>
                        <Text style={styles.featuresvalues}>
                            Blurb
                        </Text>
                        <Text style={styles.featuresvalues}>{'\n\n'}Your Recording Values:{'\n\n'}{mfccmean && mfccmean.length > 0 ? '\n' + mfccmean.map(val => parseFloat(val).toFixed(2)).join(', \n') : 'No MFCC mean'}</Text>
                    </View>

                    <View style={{ backgroundColor: 'white', marginBottom: -30, padding: 20, marginHorizontal: 30, borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
                        <Text style={styles.featuresvaluestitle}>MFCC Variance: {'\n'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', height: 250, backgroundColor: 'white', padding: 20, marginHorizontal: 30, }}>
                        <YAxis

                            data={mfccvar} // Use inverted values
                            svg={{
                                fontSize: 10, fill: '#895C5B', fontWeight: '600'
                            }}
                            numberOfTicks={8} // Adjust the number of ticks as needed
                            formatLabel={(value, index) => index + 1 === 0 ? '' : `${value.toFixed(0)}`} // Customize format for y-axis labels
                            min={0} // Set the minimum value of the y-axis to 0
                            max={12200} // Set the maximum value of the y-axis to 3500
                            style={{ marginBottom: 5 }} // Adjust style to create space for x-axis labels
                            contentInset={{ top: 10, bottom: 10 }} // Adjust content inset for better visibility

                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <BarChart
                                style={{ flex: 1 }}
                                data={mfccvar} // Use inverted values
                                svg={{ fill: '#79D5D8' }}
                                contentInset={{ top: 15, bottom: 10 }}
                            >
                                <Grid />
                            </BarChart>
                            <XAxis
                                data={mfccvar} // Use inverted values
                                formatLabel={(value, index) => (index + 1).toString()} // Display index number
                                contentInset={{ left: 10, right: 10 }} // Adjust content inset for better visibility
                                svg={{
                                    fontSize: 10, fill: '#895C5B', fontWeight: '600'
                                }} // Style the x-axis labels with white color and font weight 500
                                style={{ paddingTop: 10, marginHorizontal: 10 }} // Adjust style to align labels properly
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 30, marginBottom: 20, borderBottomRightRadius: 20, backgroundColor: 'white', borderBottomLeftRadius: 20 }}>
                        <Text style={styles.featuresvalues}>
                            Blurb
                        </Text>
                        <Text style={styles.featuresvalues}>{'\n\n'}Your Recording Values:{'\n\n'}{mfccvar && mfccvar.length > 0 ? '\n' + mfccvar.map(val => parseFloat(val).toFixed(2)).join(', \n') : 'No MFCC var'}</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', marginBottom: -30, padding: 20, marginHorizontal: 30, borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
                        <Text style={styles.featuresvaluestitle}>Pitch Period: {'\n'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', height: 250, backgroundColor: 'white', padding: 20, marginHorizontal: 30, }}>
                        <YAxis

                            data={pitchp} // Use inverted values
                            svg={{
                                fontSize: 10, fill: '#895C5B', fontWeight: '600'
                            }}
                            numberOfTicks={8} // Adjust the number of ticks as needed
                            formatLabel={(value, index) => index + 1 === 0 ? '' : `${value.toFixed(0)}x10^-4`} // Customize format for y-axis labels
                            min={0} // Set the minimum value of the y-axis to 0
                            max={60} // Set the maximum value of the y-axis to 3500
                            style={{ marginBottom: 5 }} // Adjust style to create space for x-axis labels
                            contentInset={{ top: 10, bottom: 10 }} // Adjust content inset for better visibility

                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <BarChart
                                style={{ flex: 1 }}
                                data={pitchp} // Use inverted values
                                svg={{ fill: '#79D5D8' }}
                                contentInset={{ top: 15, bottom: 10 }}
                            >
                                <Grid />
                            </BarChart>
                            <XAxis
                                data={pitchp} // Use inverted values
                                formatLabel={(value, index) => (index + 1).toString()} // Display index number
                                contentInset={{ left: 10, right: 10 }} // Adjust content inset for better visibility
                                svg={{
                                    fontSize: 10, fill: '#895C5B', fontWeight: '600'
                                }} // Style the x-axis labels with white color and font weight 500
                                style={{ paddingTop: 10, marginHorizontal: 10 }} // Adjust style to align labels properly
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 30, marginBottom: 20, borderBottomRightRadius: 20, backgroundColor: 'white', borderBottomLeftRadius: 20 }}>
                        <Text style={styles.featuresvalues}>
                            Blurb
                        </Text>
                        <Text style={styles.featuresvalues}>{'\n\n'}Your Recording Values:{'\n\n'}{pitchp && pitchp.length > 0 ? '\n' + pitchp.map(val => parseFloat(val).toFixed(5)).join(', \n') : 'No Pitch Period'}</Text>
                    </View>
                </View>
            </View>

        </ScrollView >



    )
}


const styles = StyleSheet.create({
    chartInfo: {
        borderColor: '#24A8AC',
        borderTopColor: 'white',
        borderWidth: 4,
        borderRadius: 30,
        marginHorizontal: 5,
        paddingTop: 30,
        marginTop: -30,
        backgroundColor: 'white',
    },
    mlmodel: {
        // maxWidth: 300, // Set the maximum width
        aspectRatio: 1.28, // 887 / 733.03
        // maxHeight: 250,
        // marginBottom: 10,
        height: 260,
        margin: -4,
        // borderRadius: 15,
        // width: '100%',
        resizeMode: "cover",

    },
    noRecordings: {
        fontWeight: "700",
        color: '#F08E6F',
        fontSize: 22,
        textAlign: 'center',
    },
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
    featuresvaluestitle: {

        fontSize: 18,
        // color: '#FFA386',
        color: '#2EAAAE',
        fontWeight: '800',
        // marginHorizontal: 30,
        textAlign: 'center',
        // marginTop: 40,
    },
    featuresvalues: {
        //fontFamily: "Montserrat",
        fontSize: 14,
        color: '#2EAAAE',
        fontWeight: '700',
        marginHorizontal: 20,
        textAlign: 'center',
        marginBottom: 40,

        padding: 30,
        width: '90%',
    },
    featurescontainer: {
        // position: 'relative',
        // backgroundColor: '#FFA386',
        borderRadius: 20,
        marginTop: 40,
        // width: '80%',
    },
    featuresgraphs: {
        height: 200, paddingHorizontal: 20, marginBottom: 50, marginHorizontal: 30, padding: 10, borderRadius: 10, backgroundColor: '#FFD6D4'
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

        fontSize: 18,
        //fontStyle: normal,
        fontWeight: '700',
        lineHeight: 18.5, /* 123.333% */
        letterSpacing: 0.5,
    },
    profileSubheading: {
        color: 'white',
        //fontFamily: '',
        //fontFamily: "Montserrat",
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