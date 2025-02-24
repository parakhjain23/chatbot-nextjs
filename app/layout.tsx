"use client";

import React, { createContext, useCallback, useMemo, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { store, persistor } from "../store";
import generateTheme from "../hoc/theme";
import "./globals.css";

export const ChatbotContext = createContext({
  chatbotConfig: {},
  themeColor: "#000000",
  onConfigChange: (config: any) => {},
  handleThemeChange: (color: string) => {},
  toggleHideCloseButton: () => {},
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeColor, setThemeColor] = useState("#000000");
  const [chatbotConfig, setChatbotConfig] = useState({});
  const theme = generateTheme(themeColor);

  const onConfigChange = useCallback(
    (config) => {
      if (!config) return;
      console.log("Received config:", config);

      setThemeColor(config.themeColor || "#000000");
      setChatbotConfig((prev) => ({
        ...prev,
        hideCloseButton: config.hideCloseButton ?? prev.hideCloseButton,
      }));
    },
    [chatbotConfig]
  );

  const handleThemeChange = useCallback((color) => {
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
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ChatbotContext.Provider
                value={useMemo(
                  () => ({
                    chatbotConfig,
                    themeColor,
                    onConfigChange,
                    handleThemeChange,
                    toggleHideCloseButton,
                  }),
                  [chatbotConfig, themeColor]
                )}
              >
                {children}
              </ChatbotContext.Provider>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
