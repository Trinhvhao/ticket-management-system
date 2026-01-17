'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { chatbotService, ChatMessage, ChatResponse } from '@/lib/api/chatbot.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  BookOpen,
  Ticket,
  ChevronRight,
  Minimize2,
} from 'lucide-react';

export default function ChatWidget() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0 && user) {
      setMessages([
        {
          id: 'welcome',
          type: 'bot',
          content: `Hi ${user.fullName}! 👋 I'm NexusFlow Assistant. How can I help you today?`,
          timestamp: new Date(),
          suggestions: ['Search knowledge base', 'Create a ticket', 'Check my tickets', 'Get help'],
        },
      ]);
    }
  }, [isOpen, user]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(message);
      
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
        options: response.options,
        articles: response.articles,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        suggestions: ['Try again', 'Create ticket'],
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.toLowerCase().includes('create') && suggestion.toLowerCase().includes('ticket')) {
      router.push('/tickets/new');
      setIsOpen(false);
    } else if (suggestion.toLowerCase().includes('check') && suggestion.toLowerCase().includes('ticket')) {
      router.push('/tickets');
      setIsOpen(false);
    } else {
      handleSendMessage(suggestion);
    }
  };

  const handleArticleClick = (articleId: number) => {
    router.push(`/knowledge/${articleId}`);
    setIsOpen(false);
  };

  const handleOptionClick = (action: string) => {
    switch (action) {
      case 'create_ticket':
        router.push('/tickets/new');
        setIsOpen(false);
        break;
      case 'check_tickets':
        router.push('/tickets');
        setIsOpen(false);
        break;
      case 'search':
        handleSendMessage('Search knowledge base');
        break;
      case 'tech_support':
        router.push('/tickets/new');
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#0052CC] text-white rounded-full shadow-lg hover:bg-[#0047B3] transition-all hover:scale-105 flex items-center justify-center z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all ${
            isMinimized ? 'w-80 h-14' : 'w-96 h-[32rem]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0052CC] text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">NexusFlow Assistant</h3>
                {!isMinimized && <p className="text-xs text-blue-100">Online</p>}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(32rem-8rem)]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          msg.type === 'user'
                            ? 'bg-[#0052CC] text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>

                      {/* Articles */}
                      {msg.articles && msg.articles.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.articles.map((article) => (
                            <button
                              key={article.id}
                              onClick={() => handleArticleClick(article.id)}
                              className="w-full flex items-center space-x-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
                            >
                              <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="text-sm text-blue-700 line-clamp-1">{article.title}</span>
                              <ChevronRight className="w-4 h-4 text-blue-400 ml-auto flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Options */}
                      {msg.options && msg.options.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOptionClick(option.action)}
                              className="w-full flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                            >
                              {option.action === 'create_ticket' && <Ticket className="w-4 h-4 text-gray-600" />}
                              {option.action === 'search' && <BookOpen className="w-4 h-4 text-gray-600" />}
                              <span className="text-sm text-gray-700">{option.text}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Suggestions */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <p className="text-[10px] text-gray-400 mt-1 px-1">
                        {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-10 h-10 bg-[#0052CC] text-white rounded-full flex items-center justify-center hover:bg-[#0047B3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
