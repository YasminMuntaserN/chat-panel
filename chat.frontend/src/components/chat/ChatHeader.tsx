import { useChat } from "../../context/ChatProvider";
import {format} from "date-fns";

function ChatHeader(){
  const {selectedUser  }=useChat();
  return (
            <div className={`p-4 border-b border-gray-200 bg-background`}>
                <div className="flex items-center space-x-4">
                    <img
                        src={selectedUser?.avatar}
                        alt={selectedUser?.username}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">
                            {selectedUser?.username}
                        </h2>
                        {selectedUser?.status === 0 ?   
                            <p className="text-xs text-gray-400">
                                Last seen: {format(new Date(selectedUser?.lastSeen), 'HH:mm')}
                            </p>
                            :
                            <p className="text-green-600 font-medium ">
                             Online
                            </p>
                        }
                    </div>
                </div>
            </div>
  );
}

export default ChatHeader;