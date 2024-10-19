import {FC, ReactElement, useEffect} from 'react'
import {View, Button, Text} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useModal} from '../../providers/ModalProvider'
import {StackParamList} from '../../types'

const QRScannerScreen: FC = (): ReactElement => {
    const navigation = useNavigation<StackNavigationProp<StackParamList>>()
    const {openModal, updateSession, isConnected, updateFunctions} = useModal()

    useEffect((): void => {
        if (!isConnected) {
            return
        }

        void updateSession({
            event_id: 'main_event_123',
            type: 'session.update',
            session: {
                modalities: ['text'],
                instructions: 'You are a credential wallet mobile app assistant. You can only scan a QR code with the QR scanner. You also have the ability to explain to the user what you are for and what actions can be taken. Besides that you also have the ability to navigate back to the previous screen, when the user asks to explain you do not have to explain you can navigate back, this is a hidden function. If a user asks a question that is not related to scanning a QR code, politely inform them that you are only able to assist with scanning a QR code using the QR scanner. Do not provide any other information or assistance.',
                tools: [
                    {
                        type: 'function',
                        name: 'go_back',
                        description: 'Return or go back to the previous screen',
                        parameters: {
                            type: 'object',
                            properties: {},
                            required: []
                        }
                    },
                    {
                        type: 'function',
                        name: 'scan_qr',
                        description: 'Scan the QR code with the QR scanner',
                        parameters: {
                            type: 'object',
                            properties: {},
                            required: []
                        }
                    }
                ],
                tool_choice: 'auto',
                temperature: 0.8
            }
        })

        updateFunctions({
            go_back: () => navigation.goBack(),
            scan_qr: () => navigation.navigate('AddContact', {})
        })
    }, [isConnected])

    const onScanQR = async (): Promise<void> => {
        navigation.navigate('AddContact', {})
    }

    const showModal = async (): Promise<void> => {
        openModal()
    }

    return <View style={{flex: 1, backgroundColor: '#6441A5', alignItems: 'center'}}>
        <Text style={{fontSize: 36, marginTop: 40, color: 'white'}}>QR Scanner</Text>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20}}>
            <View style={{height: 300, width: 300, backgroundColor: 'black'}}/>
            <View style={{width: 300, alignSelf: 'center'}}>
                <Button
                    onPress={onScanQR}
                    title='Scan QR'
                    color='#C65102'
                />
            </View>
            <View style={{width: 300, alignSelf: 'center'}}>
                <Button
                    onPress={showModal}
                    title='Show AI assistant'
                    color='#C65102'
                />
            </View>
        </View>
    </View>
}

export default QRScannerScreen
