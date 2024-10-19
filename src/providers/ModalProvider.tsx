import React, {createContext, useState, useContext, useEffect} from 'react'
import {Modal, View, Button} from 'react-native'
import {GiftedChat, IMessage} from 'react-native-gifted-chat'
import {v4 as uuidv4} from 'uuid'
import useAIAssistant from '../hooks/AIAssistantHook'

type ModalContextType = {
    isConnected: boolean
    openModal: () => void
    closeModal: () => void
    updateSession: (session: Record<string, any>) => Promise<void>
    updateFunctions: (functions: Record<string, any>) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider')
    }

    return context
}

export const ModalProvider = ({ children }: { children: any}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [messages, setMessages] = useState<Array<IMessage>>([])

    const onSendMessage = (newMessages: Array<IMessage> = []): void => {
        // @ts-ignore
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    };

    const {isConnected, sendPrompt, updateSession, updateFunctions} = useAIAssistant({ onResponse: onSendMessage })

    useEffect((): void => {
        setMessages([
            {
                _id: 1,
                text: 'Hello! How can I assist you today?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Sphereon Assistant',
                    avatar: 'https://play-lh.googleusercontent.com/jQme0II-P0joIy0VBanDAY7RyccZvP4c6A7us6t3oGzcnNOvc6KcfS05m7Gq8jUOR-s=w240-h480-rw',
                },
            },
        ]);
    }, []);

    const openModal = (): void => {
        setIsVisible(true)
    }

    const closeModal = (): void => {
        setIsVisible(false)
    }

    const onSendPrompt = async (): Promise<void> => {
        const prompt = 'What is the weather in Almere the Netherlands?'
        await sendPrompt(prompt)
        onSendMessage([{
            text: prompt,
            user: {
                _id: 1
            },
            createdAt: new Date(),
            _id: uuidv4()
        }])
    }

    const onSendOffTopicPrompt = async (): Promise<void> => {
        const prompt = 'What is the capital of France?'
        await sendPrompt(prompt)
        onSendMessage([{
            text: prompt,
            user: {
                _id: 1
            },
            createdAt: new Date(),
            _id: uuidv4()
        }])
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal, updateSession, isConnected, updateFunctions }}>
            {children}
            <Modal
                transparent
                visible={isVisible}
                onRequestClose={closeModal}
                animationType='slide'
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{
                        marginTop: 'auto',
                        width: '100%',
                        height: 500,
                        padding: 24,
                        backgroundColor: '#9867C5',
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        gap: 20
                    }}>
                        {/*{ isConnected &&*/}
                        {/*    <View style={{width: 300, alignSelf: 'center'}}>*/}
                        {/*        <Button*/}
                        {/*            onPress={onSendPrompt}*/}
                        {/*            title='Send prompt'*/}
                        {/*            color='#C65102'*/}
                        {/*        />*/}
                        {/*    </View>*/}
                        {/*}*/}
                        {/*{ isConnected &&*/}
                        {/*    <View style={{width: 300, alignSelf: 'center'}}>*/}
                        {/*        <Button*/}
                        {/*            onPress={onSendOffTopicPrompt}*/}
                        {/*            title='Send off-topic prompt'*/}
                        {/*            color='#C65102'*/}
                        {/*        />*/}
                        {/*    </View>*/}
                        {/*}*/}
                        <GiftedChat
                            messages={messages}
                            onSend={(messages: Array<IMessage>): void => {
                                onSendMessage(messages)
                                void sendPrompt(messages[0].text)
                            }}
                            user={{
                                _id: 1
                            }}
                        />
                        <View style={{width: 300, alignSelf: 'center', marginTop: 'auto'}}>
                            <Button
                                onPress={closeModal}
                                title='Close'
                                color='#C65102'
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </ModalContext.Provider>
    )
}
