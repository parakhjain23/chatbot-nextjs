'use client';
import { ThemeContext } from '@/components/AppWrapper';
import { useSearchParams } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export const ChatbotContext = createContext({
    chatbotConfig: {},
    chatbot_id: "",
    userId: "",
    token: "",
    themeColor: "#000000",
    onConfigChange: (config: any) => { },
    toggleHideCloseButton: () => { },
});
function chatbotLayout({ children }: any) {
    const search = useSearchParams();
    const [chatbotConfig, setChatbotConfig] = useState({});
    const { themeColor, handleThemeChange } = useContext(ThemeContext);
    const { chatbot_id, userId, token, config } = JSON.parse(
        search.get("interfaceDetails") || "{}"
    );
    const onConfigChange = useCallback((config: any) => {
        if (!config) return;
        handleThemeChange(config.themeColor || "#000000");
        setChatbotConfig((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(config) && config) {
                return { ...prev, ...config, hideCloseButton: config.hideCloseButton ?? prev.hideCloseButton };
            }
            return prev;
        });
    }, [handleThemeChange]);

    useEffect(() => {
        if (config) onConfigChange(config);
    }, [config]);

    const toggleHideCloseButton = useCallback(() => {
        setChatbotConfig((prev) => ({
            ...prev,
            hideCloseButton: !prev.hideCloseButton,
        }));
    }, []);

    return (
        <ChatbotContext.Provider
            value={{
                chatbotConfig,
                chatbot_id,
                userId,
                token,
                themeColor,
                toggleHideCloseButton,
            }}
        >
            {children}
        </ChatbotContext.Provider>
    )
}
export default chatbotLayout;
