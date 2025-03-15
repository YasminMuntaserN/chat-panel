import { createContext, useContext, useRef, useCallback, ReactNode } from 'react';
import * as signalR from '@microsoft/signalr';
import type { Message } from '../types/chat';

interface SignalRContextType {
    connect: (userId: string) => Promise<void>;
    disconnect: () => void;
    sendMessage: (receiverId: string, content: string) => Promise<void>;
    markMessageAsRead: (messageId: string) => Promise<void>;
    onReceiveMessage: (callback: (message: Message) => void) => void;
    onMessageRead: (callback: (messageId: string) => void) => void;
    onUserConnected: (callback: (userId: string) => void) => void;
    onUserDisconnected: (callback: (userId: string) => void) => void;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

const HUB_URL = 'http://localhost:5148/chatHub';

export function SignalRProvider({ children }: { children: ReactNode }) {
    const hubConnection = useRef<signalR.HubConnection>();

    const connect = useCallback(async (userId: string) => {
        hubConnection.current = new signalR.HubConnectionBuilder()
            .withUrl(`${HUB_URL}?userId=${userId}`)
            .withAutomaticReconnect()
            .build();

        try {
            await hubConnection.current.start();
            console.log('Connected to SignalR Hub');
        } catch (error) {
            console.error('Error connecting to SignalR Hub:', error);
            throw error;
        }
    }, []);

    const disconnect = useCallback(() => {
        hubConnection.current?.stop();
    }, []);

    const onReceiveMessage = useCallback((callback: (message: Message) => void) => {
        hubConnection.current?.on('ReceiveMessage', callback);
    }, []);

    const onMessageRead = useCallback((callback: (messageId: string) => void) => {
        hubConnection.current?.on('MessageRead', callback);
    }, []);

    const onUserConnected = useCallback((callback: (userId: string) => void) => {
        hubConnection.current?.on('UserConnected', callback);
    }, []);

    const onUserDisconnected = useCallback((callback: (userId: string) => void) => {
        hubConnection.current?.on('UserDisconnected', callback);
    }, []);

    const sendMessage = useCallback(async (receiverId: string, content: string) => {
       await hubConnection.current?.invoke('SendMessage', receiverId, content);
    }, []);


    const markMessageAsRead = useCallback(async (messageId: string) => {
        await hubConnection.current?.invoke('MarkMessageAsRead', messageId);
    }, []);

    return (
        <SignalRContext.Provider value={{
            connect,
            disconnect,
            sendMessage,
            markMessageAsRead,
            onReceiveMessage,
            onMessageRead,
            onUserConnected,
            onUserDisconnected
        }}>
            {children}
        </SignalRContext.Provider>
    );
}

export function useSignalR() {
    const context = useContext(SignalRContext);
    if (!context) {
        throw new Error('useSignalR must be used within a SignalRProvider');
    }
    return context;
}