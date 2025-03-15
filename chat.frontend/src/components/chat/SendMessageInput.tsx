import { useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../context/ChatProvider';


function SendMessageInput() {
  const [message, setMessage] = useState('');
  const { selectedUser ,sendMessage } = useChat();

  
  const handleSend = () => {
        if (!message.trim()) return;
        if (!selectedUser) return;

       sendMessage(selectedUser.id, message)
          .then(() => setMessage(''))
          .catch((err) => console.error('Failed to send message:', err));

    };



  return (
    <div className={`flex items-center gap-2 p-4 bg-background shadow-lg`}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
        className={`flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-accent`}
      />
      <button
        onClick={handleSend}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}

export default SendMessageInput;