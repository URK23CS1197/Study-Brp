import React, { useState, useEffect, useRef } from 'react';
// 🔑 REMOVE: import { rtdb, auth } from '../../api/firebase';
// 🔑 IMPORT Socket.io client
import { io } from 'socket.io-client'; 

// 💡 Define the WebSocket URL (Use the same Render URL as your API)
const SOCKET_URL = 'http://localhost:5000'; // Replace with your Render URL (e.g., https://your-render-service.onrender.com)

function PeerChat({ pathId }) {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const chatRef = useRef(null);
    const socketRef = useRef(null); // Ref to hold the WebSocket connection

    // --- MOCK USER INFO (Assume you get this from Auth Context/localStorage) ---
    // 🔑 REPLACE: const userId = auth.currentUser ? auth.currentUser.uid : 'guest_user';
    // 🔑 REPLACE: const userName = auth.currentUser ? auth.currentUser.displayName || 'Anonymous' : 'Anonymous';
    const userId = localStorage.getItem('userId') || 'guest_user';
    const userName = localStorage.getItem('userName') || 'Anonymous Peer';


    // 1. WebSocket Connection and Event Listeners
    useEffect(() => {
        if (!pathId) return;

        // Establish the WebSocket connection
        socketRef.current = io(SOCKET_URL, {
            query: { pathId, userId, userName } // Pass identification details to the server
        });

        const socket = socketRef.current;

        // Event 1: Load initial messages (If the server sends history upon connection)
        socket.on('chat:history', (history) => {
             setMessages(history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
        });

        // Event 2: Receive new messages from any peer
        socket.on('chat:message', (newMessage) => {
            setMessages((m) => [...m, newMessage].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
        });

        // Event 3: Update list of online users
        socket.on('presence:users', (userList) => {
            setOnlineUsers(userList);
        });

        // Cleanup: Disconnect the socket when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, [pathId, userId, userName]); // Reconnect if path or user info changes


    // 2. Auto-Scroll Chat (Design Logic Preserved)
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    // 3. Send Message Handler
    const handleSend = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !pathId || !socketRef.current) return;

        const messageData = {
            userId: userId,
            userName: userName,
            text: messageInput,
            timestamp: new Date().toISOString(), // Use ISO string for consistent sorting
        };

        // 🔑 REAL-TIME SEND: Emit the message event to the server
        socketRef.current.emit('chat:sendMessage', messageData);

        setMessageInput('');
    };

    // --- UI REMAINS THE SAME (DESIGN PRESERVED) ---

    return (
        <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 h-[600px] flex max-w-4xl mx-auto">
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            </div>

            {/* Online Users Sidebar */}
            <div className="relative z-10 w-1/4 bg-white/10 backdrop-blur-sm border-r border-white/20 p-4 flex flex-col">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-white/80 text-sm font-medium">Online Peers ({onlineUsers.length})</span>
                </div>
                <ul className="space-y-2 overflow-y-auto flex-1">
                    {/* The online users list now comes from the Socket.io presence events */}
                    {onlineUsers.map((user) => (
                        <li
                            key={user.id}
                            className="flex items-center p-2 bg-white/5 rounded-xl text-white/80 text-sm hover:bg-white/10 hover:scale-105 transition-all duration-300"
                        >
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Window */}
            <div className="relative z-10 w-3/4 flex flex-col p-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
                    Study Group Chat
                </h3>

                {/* Message History */}
                <div
                    ref={chatRef}
                    className="flex-1 overflow-y-scroll mb-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 space-y-3"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.timestamp + msg.userId} // Unique key based on time/user
                            className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] p-3 rounded-xl text-sm transition-all duration-300 hover:scale-105 ${
                                    msg.userId === userId
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                        : 'bg-gradient-to-r from-gray-700 to-gray-900 text-white/90'
                                }`}
                            >
                                <p className="font-semibold text-xs mb-1">{msg.userName}</p>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSend} className="flex gap-3">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Discuss the topic..."
                        className="flex-1 p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-base"
                    />
                    <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </form>
            </div>

            {/* Floating Elements */}
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-purple-400/20 rounded-full blur-xl animate-float delay-1000"></div>
        </div>
    );
}

export default PeerChat;