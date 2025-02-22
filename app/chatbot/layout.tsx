'use client';

import { createContext, useContext } from 'react';


export const ChatbotContext = createContext({});

export default function ChatbotLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const chatbotContext = useContext(ChatbotContext);

    return (
        <ChatbotContext.Provider value={chatbotContext}>
            {children}
        </ChatbotContext.Provider>
    );
}
