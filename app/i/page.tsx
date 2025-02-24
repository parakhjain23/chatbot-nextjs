"use client";
import React, { useContext } from "react";
import InterfaceEmbed from "../../interface/pages/InterfaceEmbed/InterfaceEmbed";
import { ChatbotContext } from "../layout";
import { Box } from "@mui/material";

const Page = () => {
  const { onConfigChange } = useContext(ChatbotContext);

  return <InterfaceEmbed onConfigChange={onConfigChange} />;
};

export default Page;
