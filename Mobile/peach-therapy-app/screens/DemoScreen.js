import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
        console.log(await getUserDetails());
    }

    async function buttonClick() {
        await getMyStuff();
    }

    async function handleRefresh() {
        await loadUserData();
    }

    return (
        <SafeAreaView style={{ justifyContent: "center", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {/* Navigation buttons */}
            <NavButton navigation={navigation} pageName={"Welcome"} destination={'Welcome'} />
            <NavButton navigation={navigation} pageName={"Login"} destination={'Login'} />
            <NavButton navigation={navigation} pageName={"DropdownComponent"} destination={'DropdownComponent'} />

            <NavButton navigation={navigation} pageName={"Account"} destination={'Account'} />
            <NavButton navigation={navigation} pageName={"Settings"} destination={'Settings'} />
            <NavButton navigation={navigation} pageName={"Tutorial"} destination={'Tutorial'} />
            <NavButton navigation={navigation} pageName={"Terms"} destination={'Terms'} />
            <NavButton navigation={navigation} pageName={"Calendar"} destination={'Calendar'} />
            <NavButton navigation={navigation} pageName={"Notifications"} destination={'Notifications'} />
            <NavButton navigation={navigation} pageName={"Charts"} destination={'DonutChart'} />
            <NavButton navigation={navigation} pageName={"Firebase"} destination={'Statistics'} />
            <NavButton navigation={navigation} pageName={"Waveform"} destination={'Waveform'} />
            <NavButton navigation={navigation} pageName={"Details"} destination={'WaveFormDetails'} />
            <NavButton navigation={navigation} pageName={"AudioScreen"} destination={'AudioScreen'} />
            {/* 
           
            <Pressable style={{ alignItems: "center", justifyContent: "center", width: 100, height: 50, margin: 5, backgroundColor: "#c9c9c9", padding: 10, borderRadius: 25 }} onPress={() => buttonClick()}>
                <Text style={{ fontWeight: 600 }}>Logout</Text>
            </Pressable>

            <Pressable style={{ alignItems: "center", justifyContent: "center", width: 100, height: 50, margin: 5, backgroundColor: "#c9c9c9", padding: 10, borderRadius: 25 }} onPress={() => handleRefresh()}>
                <Text style={{ fontWeight: 600 }}>Refresh</Text>
            </Pressable> 
            */}

            {/* Display user type */}
            <View style={{ width: 300, justifyContent: 'center', alignItems: 'center', margin: 60 }}>
                <Text Bold>CURRENT USER TYPE</Text>
                {
                    user?.profile?.user_type === 1 ?
                        <Text style={{ fontSize: 24 }}>Doctor</Text> :
                        user?.profile?.user_type === 2 ?
                            <Text style={{ fontSize: 24 }}>Patient</Text> :
                            <Text style={{ fontSize: 24, margin: 20, fontWeight: 500 }}>N/A</Text>
                }
            </View>
        </SafeAreaView>
    );
}
