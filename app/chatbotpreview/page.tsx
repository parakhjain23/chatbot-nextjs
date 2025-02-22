"use client";
import { Menu, Pencil, PlusCircle, Send } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

function ChatbotPreview() {
    const [messages, setMessages] = React.useState<{ role: string, content: string }[]>([]);
    const [threads, setThreads] = React.useState<string[]>(['Thread 1', 'Thread 2']);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        const inputMessage = inputRef.current?.value.trim();
        if (inputMessage && !isLoading) {
            setIsLoading(true);
            setMessages([...messages, { role: 'user', content: inputMessage }]);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
            // Simulate AI response
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setMessages(prev => [...prev, { role: 'assistant', content: 'This is a sample response.' }]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-base-200">
            {/* Sidebar - always visible on large screens */}
            <div className={`${isSidebarOpen ? 'fixed inset-y-0 left-0 z-40 w-64' : 'hidden'} lg:block lg:relative lg:w-64 bg-base-100 border-r flex-shrink-0`}>
                <div className="p-4 border-b">
                    <button
                        className="btn btn-primary w-full flex items-center justify-center gap-2"
                        onClick={() => setThreads([`Thread ${threads.length + 1}`, ...threads])}
                    >
                        <PlusCircle className="h-5 w-5" />
                        New Thread
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {threads.map((thread, index) => (
                        <div key={index} className="p-3 hover:bg-base-200 text-base-content cursor-pointer">
                            {thread}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile menu button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <Menu className="h-6 w-6" color='black' />
            </button>

            {/* New Thread button for mobile when sidebar is closed */}
            {!isSidebarOpen && (
                <button
                    className="lg:hidden fixed top-2 right-4 z-50 rounded-full p-2"
                    onClick={() => setThreads([`Thread ${threads.length + 1}`, ...threads])}
                >
                    <Pencil className="h-6 w-6" color='black' />
                </button>
            )}

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Chat Area - centered on large screens */}
            <div className="flex-1 flex flex-col">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-screen">
                    {/* Header */}
                    <div className="p-4">
                        <h1 className="text-xl font-semibold text-base-content text-center lg:text-left">Chatbot Preview</h1>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                        ? 'bg-primary text-primary-content'
                                        : 'bg-base-300 text-base-content'
                                        }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area - Fixed at bottom */}
                    <div className="border-t p-4 sticky bottom-0">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                ref={inputRef}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="input input-bordered flex-1 text-base-content"
                            />
                            <button
                                onClick={handleSendMessage}
                                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatbotPreview;