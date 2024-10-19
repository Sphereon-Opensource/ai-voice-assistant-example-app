import {useEffect, useState} from 'react'
import {IMessage} from 'react-native-gifted-chat'
import {v4 as uuidv4} from 'uuid'

const OPENAI_API_KEY = '[OPENAI_API_KEY]'

export type Props = {
    onResponse?: (newMessages: Array<IMessage>) => void
}

const useAIAssistant = (props: Props) => {
    const { onResponse } = props
    const [isConnected, setIsConnected] = useState(false)
    const [socket, setSocket] = useState<WebSocket>()
    const [functions, setFunctions] = useState<Record<string, any>>({})

    useEffect(() => {
        const uri = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01'
        // @ts-ignore
        const socket = new WebSocket(uri, null, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Beta': 'realtime=v1'
            }
        })

        socket.onopen = (): void => {
            socket.send(JSON.stringify({
                event_id: 'main_event_123',
                type: 'session.update',
                session: {
                    modalities: ['text'],
                    instructions: 'You are a credential wallet mobile app assistant. You can only receive credentials by starting a credential issuance flow. This flow starts with a QR scanner to scan a QR code. You also have the ability to explain to the user what you are for and what actions can be taken. If a user asks a question that is not related to receiving a credential, politely inform them that you are only able to assist with receiving a credential queries. Do not provide any other information or assistance.',
                    tools: [
                        {
                            type: 'function',
                            name: 'receive_credential',
                            description: 'Simply receive a credential when explicitly requested',
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
            }))
            setSocket(socket)
            setIsConnected(true)
        }

        socket.onerror = (e: Event): void => {
            console.error('WebSocket error:', e)
        }

        socket.onclose = (e: Event): void => {
            console.log('WebSocket closed:', e)
            setIsConnected(false)
        }

        return (): void => {
            if (socket) {
                socket.close()
            }
        }
    }, [])

    useEffect((): void => {
        if (!socket) {
            return
        }

        socket.onmessage = (e: MessageEvent<any>): void => {
            const data = JSON.parse(e.data)
            // If a function call is found, generate a response because it cannot do both at the same time. The API returns a function call or a response
            if (data.type === 'response.function_call_arguments.done') {
                const event = {
                    type: "response.create",
                    response: {
                        modalities: ['text'],
                        instructions: 'Tell me that you will begin executing what the user asked. Do not tell me you already did it, tell me that you will begin doing it'
                    }
                }
                socket.send(JSON.stringify(event))
                functions[data.name]()
            }

            if (data.type === 'response.text.done' && onResponse) {
                void onResponse([{
                    _id: uuidv4(),
                    text: data.text,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Sphereon Assistant',
                        avatar: 'https://play-lh.googleusercontent.com/jQme0II-P0joIy0VBanDAY7RyccZvP4c6A7us6t3oGzcnNOvc6KcfS05m7Gq8jUOR-s=w240-h480-rw'
                    }
                }])
            }
            console.log(JSON.parse(e.data.toString()))
        }
    }, [functions])

    const updateSession = async (session: Record<string, any>): Promise<void> => {
        console.log(`updating session: ${JSON.stringify(session)}`)
        if (!socket || !isConnected) {
            return Promise.reject(Error('Socket not connected'))
        }

        socket.send(JSON.stringify(session))
    }

    const sendPrompt = async (prompt: string): Promise<void> => {
        console.log(`sending prompt: ${prompt}`)
        if (!socket || !isConnected) {
            return Promise.reject(Error('Socket not connected'))
        }

        const event = {
            type: 'conversation.item.create', // TODO check if we cannot instantly do a  response.create
            item: {
                type: 'message',
                role: 'user',
                content: [
                    {
                        type: 'input_text',
                        text: prompt
                    }
                ]
            }
        };
        socket.send(JSON.stringify(event));
        socket.send(JSON.stringify({type: 'response.create'}));
    }

    const updateFunctions = (functions: Record<string, any>): void => {
        setFunctions(functions)
    }

    return {
        isConnected,
        sendPrompt,
        updateSession,
        updateFunctions
    }
}

export default useAIAssistant
