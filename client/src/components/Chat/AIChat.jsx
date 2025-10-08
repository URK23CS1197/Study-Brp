import React, { useState } from 'react';
// 🔑 IMPORT the generic API function for text-based queries, and the specific multimodal function
import { apiPost, explainUploadedNotes } from '../../api/backend_calls'; 

// Function to handle the conversational chat (Text-only Q&A)
const sendChatQuery = (message, messagesHistory) => {
    // This assumes you create a POST /api/chat/query route on your Express server 
    // to handle the conversation context and call Gemini.
    return apiPost('/chat/query', { 
        message, 
        history: messagesHistory.map(m => ({ role: m.role, content: m.text }))
    });
};


function AIChat({ currentTopic }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isExplaining, setIsExplaining] = useState(false);

    // ❌ REMOVED: const [chatSession] = useState(() => ai.chats.create({ model: "gemini-2.5-flash" }));
    // The server (Render Express service) now handles the Gemini client and session state.

    // Handle text-only queries (Now calling the Express backend)
    const handleChatQuery = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        // Optimistically add user message to the UI
        setMessages((m) => [...m, userMessage]); 
        const currentInput = input;
        setInput('');

        try {
            // ----------------------------------------------------
            // 🔑 REAL API CALL: POST /api/chat/query
            // ----------------------------------------------------
            // Send the user's message PLUS the message history for context
            const result = await sendChatQuery(currentInput, [...messages, userMessage]); 
            
            const aiMessage = { role: 'ai', text: result.response };
            setMessages((m) => [...m, aiMessage]);

        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages((m) => [...m, { role: 'ai', text: 'Tutor is offline. Check Render service connection.' }]);
        }
    };

    // Handle file upload and multimodal call (Now calling the Express backend)
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const question = prompt("What exactly in this note do you need help with?");
        if (!question) return;

        setIsExplaining(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                // Get the Base64 data to send in the POST request body
                const base64Data = event.target.result.split(',')[1];
                
                // ----------------------------------------------------
                // 🔑 REAL API CALL: POST /api/notes-explain
                // ----------------------------------------------------
                const result = await explainUploadedNotes(base64Data, question, file.type); 

                setMessages((m) => [
                    ...m,
                    { role: 'ai', text: `**Regarding your notes:**\n${result.explanation}` },
                ]);
            } catch (error) {
                console.error('Multimodal Error:', error);
                setMessages((m) => [...m, { role: 'ai', text: 'Failed to analyze notes. Check server logs.' }]);
            } finally {
                setIsExplaining(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-6 max-w-2xl mx-auto h-[600px] flex flex-col">
            {/* Animated Background Elements (DESIGN PRESERVED) */}
            <div className="absolute inset-0">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            </div>

            {/* Header (DESIGN PRESERVED) */}
            <div className="relative z-10 mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
                    <span className="text-white/80 text-sm font-medium">AI-Powered Tutor</span>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    AI Tutor & Notes Assistant
                </h3>
            </div>

            {/* Message History (DESIGN PRESERVED) */}
            <div className="relative z-10 flex-1 overflow-y-scroll mb-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                        <span
                            className={`inline-block p-3 rounded-xl text-sm transition-all duration-300 hover:scale-105 ${
                                msg.role === 'user'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                    : 'bg-gradient-to-r from-gray-700 to-gray-900 text-white/90'
                            }`}
                        >
                            {msg.text}
                        </span>
                    </div>
                ))}
                {isExplaining && (
                    <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <div className="flex items-center justify-center text-white/80">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            Analyzing notes with Gemini...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Form and File Upload (DESIGN PRESERVED) */}
            <div className="relative z-10">
                <form onSubmit={handleChatQuery} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask your tutor or upload notes..."
                        className="flex-1 p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-base"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </form>
                <div className="mt-3 text-right">
                    <label className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
                        Upload Notes
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            accept="image/*, application/pdf"
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Floating Elements (DESIGN PRESERVED) */}
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-purple-400/20 rounded-full blur-xl animate-float delay-1000"></div>
        </div>
    );
}

export default AIChat;
