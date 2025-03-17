import ChatsList from './ChatsList';
import { SearchUsers } from '../search/SearchUsers';
import ChatArea from './ChatArea';
import { useChat } from '../../context/ChatContext';
import Tabs from "../ui/Tabs.tsx";
import { ActiveTab } from "../../types/chat.ts";
import UsersList from "./UsersList.tsx";

export function ChatPanel() {
    const { selectedUser, activeTab } = useChat();

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
            <div className="w-full lg:w-80 bg-white border-b lg:border-r border-gray-200">
                <Tabs />
                <SearchUsers />
                {activeTab === ActiveTab.chats ? <ChatsList /> : <UsersList />}
            </div>
                {selectedUser ? (
                    <ChatArea />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <p className="text-gray-500">Select a chat to start messaging</p>
                    </div>
                )}
        </div>
    );
}

export default ChatPanel;
