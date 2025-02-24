"use client";

import React, { useContext } from "react";
import { ChatbotContext } from "../../layout";
import ChatbotWrapper from "../../../interface/components/Chatbot-Wrapper/ChatbotWrapper";
import { Box } from "@mui/material";

const Page = () => {
  const { chatbotConfig, themeColor } = useContext(ChatbotContext);
  return (
    <ChatbotWrapper chatbotConfig={chatbotConfig} themeColor={themeColor} />
  );
};

export default Page;
