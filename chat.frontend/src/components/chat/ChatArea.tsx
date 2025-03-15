import Messages from "../Messages/Messages";
import ChatHeader from "./ChatHeader";
import SendMessageInput from "./SendMessageInput";

function ChatArea(){

  return (
    <div className="flex-1 flex flex-col">
        <ChatHeader />
        <Messages /> 
       <SendMessageInput/>
    </div>
  );
}

export default ChatArea;