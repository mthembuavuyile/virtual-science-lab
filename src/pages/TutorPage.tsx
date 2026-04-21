import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BookOpen } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function TutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your AI Syllabus Tutor, aligned to the Grade 10-12 Physical Sciences CAPS curriculum. What concept can I help you with today?' }
  ]);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const responseText = "That's a great question! Based on the CAPS syllabus, " + 
        (newMsg.text.toLowerCase().includes('newton') ? "Newton's Second Law states that the net force acting on an object is equal to the rate of change of momentum. In simpler terms, F_net = ma. Let's look at an example." :
         "this concept is critical for understanding chemical and physical interactions. Can you be more specific on which module you are focusing on?");
      
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: responseText }]);
    }, 1000);
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const prefill = (topic: string) => {
    setInput(`Can you explain ${topic} according to the syllabus?`);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Sparkles className="text-purple-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Caps AI Tutor</h2>
            <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a physics or chemistry question..."
              className="w-full bg-slate-100 border-none rounded-xl pr-14 pl-4 py-3.5 focus:ring-2 focus:ring-blue-500 transition-shadow outline-none text-slate-800 placeholder:text-slate-500"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 flex items-center justify-center transition-colors"
              disabled={!input.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Topics Sidebar */}
      <div className="w-72 hidden lg:flex flex-col gap-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          Suggested Topics
        </h3>
        
        <button className="text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group" onClick={() => prefill("Newton's Second Law")}>
          <div className="text-[10px] font-bold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded uppercase mb-2">Physics</div>
          <div className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">Newton's 2nd Law</div>
          <div className="text-xs text-slate-500">F = ma relationships</div>
        </button>

        <button className="text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-pink-400 hover:shadow-md transition-all group" onClick={() => prefill("Stoichiometry")}>
          <div className="text-[10px] font-bold text-pink-600 bg-pink-50 inline-block px-2 py-0.5 rounded uppercase mb-2">Chemistry</div>
          <div className="font-bold text-slate-800 mb-1 group-hover:text-pink-600 transition-colors">Stoichiometry</div>
          <div className="text-xs text-slate-500">Balancing equations</div>
        </button>

        <button className="text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group" onClick={() => prefill("Ohm's Law")}>
          <div className="text-[10px] font-bold text-amber-600 bg-amber-50 inline-block px-2 py-0.5 rounded uppercase mb-2">Physics</div>
          <div className="font-bold text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">Ohm's Law</div>
          <div className="text-xs text-slate-500">Voltage vs Current</div>
        </button>
      </div>
    </div>
  );
}
