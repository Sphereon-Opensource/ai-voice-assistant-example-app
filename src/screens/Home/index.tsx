import {FC, ReactElement, useEffect} from 'react'
import {View, Button, Text} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useModal} from '../../providers/ModalProvider'
import {StackParamList} from '../../types'

const HomeScreen: FC = (): ReactElement => {
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
                instructions: 'You are a credential wallet mobile app assistant. You can only receive credentials by starting a credential issuance flow. This flow starts with a QR scanner to scan a QR code. You also have the ability to explain to the user what you are for and what actions can be taken. If a user asks a question that is not related to receiving a credential, politely inform them that you are only able to assist with receiving a credential queries. Do not provide any other information or assistance. Use the tools provided to get the credential',
                tools: [
                    {
                        type: 'function',
                        name: 'receive_credential',
                        description: 'Simply retrieves Receive a credential when explicitly requested',
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
            receive_credential: () => navigation.navigate('QRScanner', {})
        })
    }, [isConnected])

    const startFlow = async (): Promise<void> => {
        navigation.navigate('QRScanner', {})
    }

    const showModal = async (): Promise<void> => {
        openModal()
    }

    return <View style={{flex: 1, backgroundColor: '#6441A5', alignItems: 'center'}}>
        <Text style={{fontSize: 36, marginTop: 40, color: 'white'}}>Home</Text>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20}}>
            <View style={{width: 300, alignSelf: 'center'}}>
                <Button
                    onPress={startFlow}
                    title='Start Flow'
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

export default HomeScreen

