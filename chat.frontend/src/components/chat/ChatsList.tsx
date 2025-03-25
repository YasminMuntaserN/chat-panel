import { format } from 'date-fns';
import type { Conversation } from '../../types/chat';
import {useChat} from "../../context/ChatContext.tsx";
import {useEffect} from "react";

function ChatsList() {
    const { filteredConversations, selectedUser, selectUser,messages ,markMessageAsRead  } = useChat();
    
    useEffect(() => {
        if (selectedUser) {
            messages.forEach(message => {
                if (!message.isRead) {
                    markMessageAsRead(message.id);
                }
            });
        }
    }, [selectedUser, messages, markMessageAsRead]);
    
    return (
        <div className="overflow-y-auto h-[calc(100vh-8rem)]">
            {filteredConversations && filteredConversations.length > 0 ? (
                filteredConversations.map((conversation: Conversation) => (
                    <div
                        key={conversation?.user?.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                            selectedUser?.id === conversation?.user?.id ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => selectUser(conversation.user)}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src={conversation.user?.avatar}
                                    alt={conversation.user?.username}
                                    className={`rounded-full w-12 h-12`}
                                />
                                    <span
                                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                            conversation.user?.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                                        }`}
                                    />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className={`font-medium text-text truncate`}>
                                        {conversation.user?.username}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        {format(new Date(conversation.lastMessageTime), 'HH:mm')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 truncate">
                                        {conversation.lastMessage}
                                    </p>
                                    {conversation.unreadMessages > 0 && (<span className={`ml-2 px-2 py-1 text-xs text-white bg-primary rounded-full`}>
                                            {conversation.unreadMessages}
                                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No conversations found</p>
                </div>
            )}
        </div>
    );
}

export default ChatsList;