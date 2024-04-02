import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import WaveformScreen from '../screens/WaveFormScreen';
import AccountPersonalSettings from '../screens/AccountPersonalSettings';
import AccountSettings from '../screens/AccountSettings';
import Tutorial from '../screens/Tutorial';
import TermsNConditions from '../screens/TermsNConditions';
import Notifications from '../screens/Notifications';
import Calendar from '../screens/Calendar';
import DonutChart from '../screens/DonutChart';
import DemoScreen from '../screens/DemoScreen';
// import PatientsGallery from '../screens/PatientsGallery';
import WaveFormDetails from '../screens/WaveFormDetails';
// import AudioScreen from '../screens/AudioScreen';
import DropdownComponent from '../screens/waste/DropdownComponent';
import PatientsGallery from '../screens/PatientsGallery';
import ClinicianMenu from '../screens/ClinicianMenu';
import PatientDetailsScreen from '../screens/PatientDetailsScreen';
import ProfileComp from '../components/ProfileComp';

const Stack = createNativeStackNavigator();

//Nazifa: Look into Bottom Stack Navigator

export function MyStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'none'
            }}

            initialRouteName="ProfileComp"
        >
            <Stack.Screen
                name='Demo'
                component={DemoScreen}
                options={{ title: 'Demo' }}
            />
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ title: 'Welcome' }}
            />
            <Stack.Screen
                name='Login'
                component={LoginScreen}
                options={{ title: 'Login' }}
            />
            <Stack.Screen
                name='Waveform'
                component={WaveformScreen}
                options={{ title: 'Waveform' }}
            />
            <Stack.Screen
                name='PatientsGallery'
                component={PatientsGallery}
                options={{ title: 'PatientsGallery' }}
            />
            <Stack.Screen
                name='ProfileComp'
                component={ProfileComp}
                options={{ title: 'ProfileComp' }}
            />
            <Stack.Screen
                name='PatientDetailsScreen'
                component={PatientDetailsScreen}
                options={{ title: 'PatientDetailsScreen' }}
            />
            <Stack.Screen
                name='ClinicianMenu'
                component={ClinicianMenu}
                options={{ title: 'ClinicianMenu' }}
            />
            <Stack.Screen
                name='WaveFormDetails'
                component={WaveFormDetails}
                options={{ title: 'WaveFormDetails' }}
            />
            <Stack.Screen
                name='Account'
                component={AccountSettings}
                options={{ title: 'Account' }}
            />
            {/* <Stack.Screen
                name='AudioScreen'
                component={AudioScreen}
                options={{ title: 'AudioScreen' }}
            /> */}
            <Stack.Screen
                name='DonutChart'
                component={DonutChart}
                options={{ title: 'Charts' }}
            />
            <Stack.Screen
                name='Settings'
                component={AccountPersonalSettings}
                options={{ title: 'Settings' }}
            />
            <Stack.Screen
                name='Tutorial'
                component={Tutorial}
                options={{ title: 'Tutorial' }}
            />
            <Stack.Screen
                name='Terms'
                component={TermsNConditions}
                options={{ title: 'Terms' }}
            />
            <Stack.Screen
                name='Notifications'
                component={Notifications}
                options={{ title: 'Notifications' }}
            />
            <Stack.Screen
                name='Calendar'
                component={Calendar}
                options={{ title: 'Calendar' }}
            />
            {/* <Stack.Screen
                name='DropdownComponent'
                component={DropdownComponent}
                options={{ title: 'DropdownComponent' }}
            /> */}

        </Stack.Navigator>
    )
}