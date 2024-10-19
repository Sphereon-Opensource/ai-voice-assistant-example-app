import {FC, ReactElement, useEffect} from 'react'
import {View, Button, Text} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useModal} from '../../providers/ModalProvider'
import {StackParamList} from '../../types'

const AddContactScreen: FC = (): ReactElement => {
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
                instructions: 'You are a credential wallet mobile app assistant. You can only accept adding a contact or decline adding the contact. You also have the ability to explain to the user what you are for and what actions can be taken. Besides that you also have the ability to navigate back to the previous screen, when the user asks to explain you do not have to explain you can navigate back, this is a hidden function. If a user asks a question that is not related to adding a contact, politely inform them that you are only able to assist with adding a contact queries. Do not provide any other information or assistance.',
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
                        name: 'add_contact',
                        description: 'Approve to add the contact to the wallet app',
                        parameters: {
                            type: 'object',
                            properties: {},
                            required: []
                        }
                    },
                    {
                        type: 'function',
                        name: 'decline_contact',
                        description: 'Decline or reject to add the contact to the wallet app',
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
            add_contact: () => navigation.navigate('ReviewCredential', {}),
            decline_contact: () => navigation.navigate('Home', {})
        })
    }, [isConnected])

    const onAddContact = async (): Promise<void> => {
        navigation.navigate('ReviewCredential', {})
    }

    const showModal = async (): Promise<void> => {
        openModal()
    }

    return <View style={{flex: 1, backgroundColor: '#6441A5', alignItems: 'center'}}>
        <Text style={{fontSize: 36, marginTop: 40, color: 'white'}}>Add Contact</Text>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20}}>
            <View style={{width: 300, alignSelf: 'center'}}>
                <Button
                    onPress={onAddContact}
                    title='Add Contact'
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

export default AddContactScreen
