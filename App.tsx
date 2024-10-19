import React, {ReactElement, useEffect} from 'react'
import {StatusBar} from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {NavigationContainer} from '@react-navigation/native'
import StackNavigator from './src/navigation/navigation'
import {ModalProvider} from './src/providers/ModalProvider'

export default function App(): ReactElement {
    useEffect((): void => {
        StatusBar.setBarStyle('light-content', true)
        StatusBar.setBackgroundColor('#6441A5')
        StatusBar.setTranslucent(false)
    }, [])

    return (
        <SafeAreaProvider>
            <ModalProvider>
                <NavigationContainer>
                    <StackNavigator/>
                </NavigationContainer>
            </ModalProvider>
        </SafeAreaProvider>
    )
}
