import Messages from "../Messages/Messages";
import ChatHeader from "./ChatHeader";
import SendMessageInput from "./SendMessageInput";

function ChatArea(){

  return (
    <div className="flex-1 flex flex-col bg-[#E8ECF0]">
        <ChatHeader />
        <Messages /> 
       <SendMessageInput/>
    </div>
  );
}

export default ChatArea;