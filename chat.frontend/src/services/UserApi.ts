import type { Message, User, Conversation } from '../types/chat';

const API_URL = 'http://localhost:5148/api/Chat';

export async function getMessages(userId: string ,receiverId:string): Promise<Message[]> {
    const response = await fetch(`${API_URL}/messages/${userId}/${receiverId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }
    return response.json();
}

export async function getUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
}

export async function getConversations(userId: string): Promise<Conversation[]> {
    const response = await fetch(`${API_URL}/conversations/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch conversations');
    }
    return response.json();
}