import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, RefreshControl } from 'react-native';
import NavButton from '../components/NavigationButton';
import { getUserDetails, logout } from '../apis/authenticationAPIs';
import { getMyStuff } from '../utilities/database_functions';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DemoScreen({ navigation }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        loadUserData();
    }, []);

    async function loadUserData() {
        setUser(await getUserDetails());
    }

    async function buttonClick() {
        await getMyStuff();
    }

    // Scroll refresh stuff
    const [refreshing, setRefreshing] = useState(false);
    async function handleRefresh() {
        console.log('Refreshing...');
        setRefreshing(true);
        await loadUserData();
        setRefreshing(false);
        console.log('Refreshed!');
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#0000ff']}
                    />
                }
            >
                {/* Navigation buttons */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Navigation buttons */}
                    <NavButton navigation={navigation} pageName={"Welcome"} destination={'Welcome'} />
                    <NavButton navigation={navigation} pageName={"Login"} destination={'Login'} />
                    {/* <NavButton navigation={navigation} pageName={"DropdownComponent"} destination={'DropdownComponent'} /> */}

                    <NavButton navigation={navigation} pageName={"Account"} destination={'Account'} />
                    <NavButton navigation={navigation} pageName={"Settings"} destination={'Settings'} />
                    <NavButton navigation={navigation} pageName={"Tutorial"} destination={'Tutorial'} />
                    <NavButton navigation={navigation} pageName={"Terms"} destination={'Terms'} />
                    <NavButton navigation={navigation} pageName={"Calendar"} destination={'Calendar'} />
                    <NavButton navigation={navigation} pageName={"Notifications"} destination={'Notifications'} />
                    <NavButton navigation={navigation} pageName={"Chart"} destination={'Chart'} />
                    {/* <NavButton navigation={navigation} pageName={"Firebase"} destination={'Statistics'} /> */}
                    <NavButton navigation={navigation} pageName={"Waveform"} destination={'Waveform'} />
                    <NavButton navigation={navigation} pageName={"Details"} destination={'WaveFormDetails'} />
                    <NavButton navigation={navigation} pageName={"PatientsGallery"} destination={'PatientsGallery'} />
                    <NavButton navigation={navigation} pageName={"PatientDetailsScreen"} destination={'PatientDetailsScreen'} />
                    <NavButton navigation={navigation} pageName={"ClinicianMenu"} destination={'ClinicianMenu'} />
                    {/* <NavButton navigation={navigation} pageName={"AudioScreen"} destination={'AudioScreen'} /> */}

                </View>

                {/* Display user type */}
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>CURRENT USER TYPE</Text>
                    <Text style={{ fontSize: 24 }}>
                        {user?.profile?.user_type === 1 ? 'Doctor' : user?.profile?.user_type === 2 ? 'Patient' : 'N/A'}
                    </Text>
                </View>

                {/* Additional content here */}

                {/* Example button */}
                {/* <Pressable style={{ alignItems: "center", justifyContent: "center", width: 100, height: 50, margin: 5, backgroundColor: "#c9c9c9", padding: 10, borderRadius: 25 }} onPress={() => buttonClick()}>
                    <Text style={{ fontWeight: 600 }}>Logout</Text>
                </Pressable> */}
            </ScrollView>
        </SafeAreaView>
    );
}
