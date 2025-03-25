import { format } from "date-fns";
import { useChat } from "../../context/ChatContext";
import {Message} from "../../types/chat.ts";

function Messages() {
  const { messages , selectedUser } = useChat();
  
  const isOwn =(message :Message)=> selectedUser?.id === message.receiverId
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${isOwn(message) ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
                isOwn(message)
                ? `bg-primary text-white`
                : "bg-white text-gray-900"
            }`}
          >
            <p>{message.content}</p>
            <p
              className={`text-xs mt-1 ${
                  isOwn(message)? "text-blue-100" : "text-gray-500"
              }`}
            >
              {format(new Date(message.timestamp), "HH:mm")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Messages;

