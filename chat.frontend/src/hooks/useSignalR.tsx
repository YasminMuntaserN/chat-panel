import { useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import type { Message } from '../types/chat';

const HUB_URL = 'http://localhost:5148/chatHub';

export function useSignalR() {
    const hubConnection = useRef<signalR.HubConnection>();
    const userIdRef = useRef<string>();

    const connect = useCallback(async (userId: string) => {
        userIdRef.current = userId;
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

    const onMessageSent = useCallback((callback: (message: Message) => void) => {
        hubConnection.current?.on('MessageSent', callback);
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
        console.log(`${receiverId}  , ${content} `);
        await hubConnection.current?.invoke('SendMessage', receiverId, content);
    }, []);

    const markMessageAsRead = useCallback(async (messageId: string) => {
        await hubConnection.current?.invoke('MarkMessageAsRead', messageId);
    }, []);

    return {
        connect,
        disconnect,
        onReceiveMessage,
        onMessageSent,
        onMessageRead,
        onUserConnected,
        onUserDisconnected,
        sendMessage,
        markMessageAsRead
    };
}