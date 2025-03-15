import {MessageSquare, Users} from "lucide-react";
import {useChat} from "../../context/ChatProvider.tsx";
import {ActiveTab} from "../../types/chat.ts";

function Tabs() {
 const {activeTab, setActiveTab}=useChat();
  return (
    <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 text-sm font-medium ${
                  activeTab === ActiveTab.chats
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(ActiveTab.chats)}
              >
                <MessageSquare className="w-5 h-5 mx-auto" />
              </button>
              
               <button
                className={`flex-1 py-4 text-sm font-medium ${
                  activeTab === ActiveTab.users
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(ActiveTab.users)}
              >
                <Users className="w-5 h-5 mx-auto" />
              </button>
    </div>
  )
}

export default Tabs;
