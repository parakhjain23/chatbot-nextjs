'use client';
import { ChatbotContext } from '@/components/AppWrapper';
import ChatbotWrapper from '@/components/Chatbot-Wrapper/ChatbotWrapper'
import React, { useContext } from 'react'

function Chatbot() {
    const  chatbotConfig  = useContext(ChatbotContext); 
    console.log(chatbotConfig,'parakh')
    return (
        <ChatbotWrapper />
    )
}

export default Chatbot