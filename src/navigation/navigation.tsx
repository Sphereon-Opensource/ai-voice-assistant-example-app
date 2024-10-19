import {ReactElement} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import HomeScreen from '../screens/Home'
import QRScannerScreen from '../screens/QRScanner'
import AddContactScreen from '../screens/AddContact'
import ReviewCredentialScreen from '../screens/ReviewCredential'

const Stack = createNativeStackNavigator();

const StackNavigator = (): ReactElement => {
    return (
        <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={{
                animation: 'none',
                headerShown: false
            }}>
            <Stack.Screen name={'Home'} component={HomeScreen} />
            <Stack.Screen name={'QRScanner'} component={QRScannerScreen} />
            <Stack.Screen name={'AddContact'} component={AddContactScreen} />
            <Stack.Screen name={'ReviewCredential'} component={ReviewCredentialScreen} />
        </Stack.Navigator>
    )
}

export default StackNavigator
