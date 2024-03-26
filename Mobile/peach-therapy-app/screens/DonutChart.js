import React, { useEffect } from 'react'
import { PieChart, ProgressCircle, BarChart, Grid, LineChart } from 'react-native-svg-charts'
import { Alert, Button, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, SafeAreaView, AreaChart, Pressable, ScrollView } from 'react-native';
import { Rect } from 'react-native-svg';
import { isUserSignedIn } from '../apis/authenticationAPIs';
import ProfileHeader from '../components/ProfileHeader';

export default function DonutChart({ navigation }) {
    useEffect(() => {
        if (!isUserSignedIn()) navigation.replace("Login")
    })

    const fill = 'white'
    const percent = 0.90
    const data = [50, 10, 40, 95, 85, 91, 35, 53, 45, 24, 90, 40, 90]
    function buttonClicked() {
        navigation.navigate('Settings')
    }
    function goToRecordings() {
        navigation.navigate('Waveform')
    }

    function goToNotifs() {
        navigation.navigate('Notifications')
    }
    function goToCal() {
        navigation.navigate('Calendar')
    }
    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + 'ffffff').slice(0, 7)

    const pieData = data
        .filter((value) => value > 0)
        .map((value, index) => ({
            value,
            svg: {
                fill: '#FFA386',
                onPress: () => console.log('press', index),
            },
            key: `pie-${index}`,
        }))

    return (<>
        <ScrollView style={styles.wholePage}>
            <View style={styles.navBar}>
                <SafeAreaView style={styles.container}>
                    <Pressable onPress={() => goToRecordings()}>
                        <Image source={require('../assets/Vector-4.png')}
                            style={styles.icon}
                        />
                    </Pressable>
                    <View style={styles.navSelect}>
                        <Image source={require('../assets/chartselect.png')}
                            style={styles.icon}
                        />
                    </View>
                    <Pressable onPress={() => goToCal()}>
                        <Image source={require('../assets/Vector-1.png')}
                            style={styles.icon}
                        />
                    </Pressable>
                    <Pressable onPress={() => goToNotifs()}>
                        <Image source={require('../assets/Vector-2.png')}
                            style={styles.icon}
                        />
                    </Pressable>
                    <Pressable onPress={() => buttonClicked()}>
                        <Image source={require('../assets/man.png')}
                            style={styles.icon}
                        />
                    </Pressable>
                </SafeAreaView>
            </View>

            <ProfileHeader />

            {/* ctrl click to see components insides */}
            <View style={{ justifyContent: 'center', position: 'relative', marginTop: 30, }}>
                <ProgressCircle style={{ height: 350, position: 'relative', zIndex: 1 }} strokeWidth={20} progress={percent} progressColor={'#A0E480'} backgroundColor={'#E2E8F0'} />
                <Text style={{ left: '21%', width: '60%', ...styles.bigPercent }}>{percent * 100}%

                    <Text style={{
                        fontSize: 12,
                        color: '#FFA386',
                        textAlign: 'center',
                    }}>{'\n'}Healthy Voice</Text>

                    <Text style={{
                        fontSize: 10,
                        textAlign: 'center',
                        color: '#FFA386',
                    }}>{'\n'}Keep up the good work! This graph shows your overall most current score.</Text>
                </Text>
            </View>



            {/* <View style={{
                height: 15,
                width: 300,
                backgroundColor: 'white',
                marginVertical: 10,
                marginHorizontal: 40,
                borderRadius: 10,
                padding: 3,

            }}>
                <View style={{
                    height: '100%',
                    width: '20%',
                    backgroundColor: '#F87171',
                    borderRadius: 8,
                }}>

                </View>
            </View>
            <View style={{
                height: 15,
                width: 300,
                backgroundColor: 'white',
                marginVertical: 10,
                marginHorizontal: 40,
                borderRadius: 10,
                padding: 3,

            }}>
                <View style={{
                    height: '100%',
                    width: '50%',
                    backgroundColor: '#FFEDA3',
                    borderRadius: 8,
                }}>

                </View>
            </View>
            <View style={{
                height: 15,
                width: 300,
                backgroundColor: 'white',
                marginVertical: 10,
                marginHorizontal: 40,
                borderRadius: 10,
                padding: 3,

            }}>

                <View style={{
                    height: '100%',
                    width: '90%',
                    backgroundColor: '#BBF1A1',
                    borderRadius: 8,
                }}>

                </View>
            </View> */}
            <View style={{ backgroundColor: '#FFA386', padding: 10, marginTop: 50, marginHorizontal: 30, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <Text style={{ color: 'white', fontWeight: '700', paddingHorizontal: 10, paddingTop: 10 }}>
                    Here is your Progress Report
                </Text>
                <Text style={{ color: 'white', fontWeight: '500', paddingHorizontal: 10, paddingTop: 10 }}>
                    Here is a cumulation of your progress this far. Reload Page to see new Data.
                </Text>
            </View>
            <BarChart style={{ height: 200, paddingHorizontal: 20, marginBottom: 50, marginHorizontal: 30, backgroundColor: '#FFA386', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} data={data} svg={{ fill }} contentInset={{ top: 30, bottom: 30 }}>
                <Grid />
                <LineChart
                    style={{ height: 200 }}
                    data={data}
                    svg={{ stroke: '#F08462', strokeWidth: 2 }}
                    contentInset={{ top: 30, bottom: 30 }}
                >

                </LineChart>
            </BarChart >

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
        paddingHorizontal: 15,
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