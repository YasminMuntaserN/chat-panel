import { useState, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce.ts';
import { useChat } from '../../context/ChatContext.tsx';
import { ActiveTab } from '../../types/chat';


export function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const {
    conversations,
    setFilteredConversations,
    users,
    setFilteredUsers,
    activeTab
  } = useChat();

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  useEffect(() => {
    const searchTermLower = debouncedSearchTerm.trim().toLowerCase();

    if (activeTab === ActiveTab.chats) {
      if (!searchTermLower) {
        setFilteredConversations(conversations);
        return;
      }

      const filtered = conversations.filter(conversation =>
          conversation.user.username.toLowerCase().includes(searchTermLower) ||
          conversation.lastMessage.toLowerCase().includes(searchTermLower)
      );

      setFilteredConversations(filtered);
    } else {
      if (!searchTermLower) {
        setFilteredUsers(users);
        return;
      }

      const filtered = users.filter(user =>
          user.username.toLowerCase().includes(searchTermLower)
      );

      setFilteredUsers(filtered);
    }
  }, [
    debouncedSearchTerm,
    activeTab,
    conversations,
    users,
    setFilteredConversations,
    setFilteredUsers
  ]);

  return (
      <div className="relative w-full max-w-md mx-auto p-4">
        <div className="relative">
          <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={activeTab === ActiveTab.chats ? 'Search conversations...' : 'Search users...'}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
  );
}