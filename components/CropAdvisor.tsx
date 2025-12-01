import React, { useState, useRef, useEffect } from 'react';
import { getChatStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const CropAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello! I am your AI agricultural advisor. Ask me anything about crop cycles, pest control, soil health, or sustainable farming practices.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const modelMessageId = (Date.now() + 1).toString();
    // Initialize empty model message
    setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

    try {
      let fullText = '';
      await getChatStream(messages, userMessage.text, (chunk) => {
        fullText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? { ...msg, text: fullText } : msg
        ));
      });
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === modelMessageId ? { ...msg, text: "I'm having trouble connecting to the network. Please try again.", isError: true } : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
        { id: '1', role: 'model', text: 'Hello! I am your AI agricultural advisor. Ask me anything about crop cycles, pest control, soil health, or sustainable farming practices.' }
    ]);
  }

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] flex flex-col bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
      <div className="p-4 border-b border-emerald-50 bg-emerald-50/30 flex justify-between items-center">
        <div>
            <h2 className="text-lg font-bold text-emerald-900">Crop Advisor Chat</h2>
            <p className="text-xs text-emerald-600">Powered by Gemini 2.5</p>
        </div>
        <button onClick={clearChat} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors" title="Clear Chat">
            <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-700'}
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`
              max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
              }
              ${msg.isError ? 'border-red-300 bg-red-50 text-red-800' : ''}
            `}>
              {msg.role === 'model' ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:text-gray-800 prose-ul:my-1">
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
               <Bot size={16} />
             </div>
             <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about fertilizer, planting dates, pests..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none resize-none h-14 bg-gray-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`
              absolute right-2 top-2 p-2 rounded-lg transition-all
              ${!input.trim() || isTyping 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
              }
            `}
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          AI can make mistakes. Verify important agricultural decisions.
        </p>
      </div>
    </div>
  );
};
