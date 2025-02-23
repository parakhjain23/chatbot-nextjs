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
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [themeColor, setThemeColor] = useState("#121212");
  const [chatbotConfig, setChatbotConfig] = useState({});
  const theme = generateTheme(themeColor);

  const onConfigChange = useCallback(
    (config) => {
      if (!config) return; // Prevent unnecessary updates

      setThemeColor(config.themeColor || "#000000");
      setChatbotConfig(config);
    },
    [setThemeColor, setChatbotConfig]
  );

  const handleThemeChange = useCallback((color) => {
    setThemeColor(color);
  }, []);

  return (
    <html lang="en">
      <head>
        {/* <script src="https://unpkg.com/@tailwindcss/browser@4"></script> */}
      </head>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {/* <ThemeProvider theme={theme}> */}
            <CssBaseline />
            <ChatbotContext.Provider
              value={useMemo(
                () => ({
                  chatbotConfig,
                  themeColor,
                  onConfigChange,
                  handleThemeChange,
                }),
                [chatbotConfig, themeColor]
              )}
            >
              {children}
            </ChatbotContext.Provider>
            {/* </ThemeProvider> */}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
