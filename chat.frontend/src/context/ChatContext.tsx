import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSignalR } from './SignalRContext';
import * as chatApi from '../services/UserApi';
import { Message, User, Conversation, ChatContextState, ActiveTab } from '../types/chat';
import { UserStatus } from '../types/chat';
import { useParams } from 'react-router-dom';

interface ChatContextType extends ChatContextState {
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  selectUser: (user: User | null) => void;
  filteredConversations: Conversation[];
  setFilteredConversations: (conversations: Conversation[]) => void;
  filteredUsers: User[];
  setFilteredUsers: (users: User[]) => void;
  activeTab: ActiveTab;
  setActiveTab: (activeTab: ActiveTab) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}


export function ChatProvider({ children }: ChatProviderProps) {
  const { userId } = useParams<{ userId: string }>();
  const signalR = useSignalR();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.chats);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: chatApi.getUsers
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => chatApi.getConversations(userId!!)
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', userId, selectedUser?.id],
    queryFn: () => selectedUser ? chatApi.getMessages(userId!!, selectedUser.id) : Promise.resolve([]),
    enabled: !!selectedUser
  });
  

  useEffect(() => {
    setFilteredConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    if(userId)
    setFilteredUsers(users.filter(user => user.id !== userId));
  }, [users]);

  useEffect(() => {
    const initializeSignalR = async () => {
      if (!userId) return;

      try {
        await signalR.connect(userId);

        signalR.onReceiveMessage((message) => {
          queryClient.invalidateQueries({queryKey: ['messages', userId, message.senderId],});
          queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
        });

        signalR.onMessageRead((messageId) => {
          queryClient.setQueryData<Message[]>(['messages'], (old = []) =>
              old.map(m => m.id === messageId ? { ...m, isRead: true } : m)
          );
        });

        signalR.onUserConnected((connectedUserId) => {
          queryClient.setQueryData<User[]>(['users'], (old = []) =>
              old.map(u => u.id === connectedUserId ? { ...u, status: UserStatus.Online } : u)
          );
        });

        signalR.onUserDisconnected((disconnectedUserId) => {
          queryClient.setQueryData<User[]>(['users'], (old = []) =>
              old.map(u => u.id === disconnectedUserId ? { ...u, status: UserStatus.Offline } : u)
          );
        });
      } catch (error) {
        console.error('Failed to initialize SignalR:', error);
      }
    };

    initializeSignalR();
    return () => signalR.disconnect();
  }, [userId, signalR, queryClient]);

  const sendMessage = async (receiverId: string, content: string) => {
    if (!userId) return;
    await signalR.sendMessage(receiverId, content);
    await queryClient.invalidateQueries({
      queryKey: ['messages', userId, receiverId],
    });
    await queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
  };

  const markMessageAsRead = async (messageId: string) => {
    await signalR.markMessageAsRead(messageId);
    await queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
  };

  const selectUser = (user: User | null) => {
    setSelectedUser(user);
  };
  
  if (!userId) {
    return <div>User ID is required</div>;
  }

  return (
      <ChatContext.Provider value={{
        users,
        messages,
        conversations,
        filteredConversations,
        setFilteredConversations,
        filteredUsers,
        setFilteredUsers,
        selectedUser,
        sendMessage,
        markMessageAsRead,
        selectUser,
        activeTab,
        setActiveTab,
      }}>
        {children}
      </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}