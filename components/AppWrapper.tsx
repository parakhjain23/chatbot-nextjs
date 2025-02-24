'use client';
import React, { createContext, useCallback, useMemo, useState } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { store, persistor } from '../store'
import { generateTheme } from '@/hoc/theme';

interface AppWrapperProps {
    children: React.ReactNode
    chatbotConfig?: any // TODO: Add proper type
    themeColor?: string
    onConfigChange?: (config: any) => void
    handleThemeChange?: (color: string) => void
    toggleHideCloseButton?: () => void
}

export const ChatbotContext = createContext({
    chatbotConfig: {},
    themeColor: "#000000",
    onConfigChange: (config: any) => { },
    handleThemeChange: (color: string) => { },
    toggleHideCloseButton: () => { },
});

function AppWrapper({
    children,
}: AppWrapperProps) {
    const [themeColor, setThemeColor] = useState("#333333");
    const [chatbotConfig, setChatbotConfig] = useState({});
    const theme = generateTheme(themeColor);


    const onConfigChange = useCallback(
        (config: any) => {
            if (!config) return;
            setThemeColor(config.themeColor || "#000000");
            setChatbotConfig((prev) => ({
                ...prev,
                hideCloseButton: config.hideCloseButton ?? prev.hideCloseButton,
            }));
        },
        [chatbotConfig]
    );

    const handleThemeChange = useCallback((color: string) => {
        setThemeColor(color);
    }, []);

    const toggleHideCloseButton = useCallback(() => {
        console.log("adfdf");
        setChatbotConfig((prev) => ({
            ...prev,
            hideCloseButton: !prev.hideCloseButton,
        }));
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <ChatbotContext.Provider
                        value={useMemo(
                            () => ({
                                children,
                                chatbotConfig,
                                themeColor,
                                onConfigChange,
                                handleThemeChange,
                                toggleHideCloseButton,
                            }),
                            [chatbotConfig, themeColor, children]
                        )}
                    >
                        {children}
                    </ChatbotContext.Provider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    )
}

export default AppWrapper