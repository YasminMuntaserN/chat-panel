export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  lastSeen: Date;
}

export interface Conversation {
  user: User;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export enum UserStatus {
  Offline = 0,
  Online = 1,
  Away = 2
}

export enum ActiveTab {
  chats = 'chats',
  users = 'users'
}

export interface ChatTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}



export interface ChatContextState {
  messages: Message[];
  users: User[];
  filteredUsers: User[];
  selectedUser: User | null;
  unreadCount: number;
  conversations: Conversation[];
  filteredConversations: Conversation[];
}