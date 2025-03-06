'use client';
/* eslint-disable */
import { AiIcon, UserAssistant } from "@/assests/assestsIndex";
import InterfaceGrid from "@/components/Grid/Grid";
import { Anchor, Code } from "@/components/Interface-Chatbot/Interface-Markdown/MarkdownUtitily";
import { isJSONString } from "@/utils/ChatbotUtility";
import { emitEventToParent } from "@/utils/emitEventsToParent/emitEventsToParent";
import { isColorLight } from "@/utils/themeUtility";
import {
  Box,
  Chip,
  Divider,
  lighten,
  Stack,
  useTheme
} from "@mui/material";
import copy from "copy-to-clipboard";
import { AlertCircle, Check, CircleCheckBig, Copy, Info, Maximize2, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Message.css";
import { useCustomSelector } from "@/utils/deepCheckSelector";
import { $ReduxCoreType } from "@/types/reduxCore";
import { ALLOWED_EVENTS_TO_SUBSCRIBE } from "@/utils/enums";

const ResetHistoryLine = ({ text = "" }) => {
  return (
    <Divider className="mb-2">
      <Chip
        label={text || "History cleared"}
        size="small"
        color={!text ? "error" : "success"}
      />
    </Divider>
  );
};

const UserMessageCard = React.memo(({ message, theme, textColor }: any) => {
  return (
    <>
      <div className="flex flex-col gap-2.5 items-end w-full mb-2.5 animate-slide-left">
        {Array.isArray(message?.urls) && message.urls.length > 0 && (
          <div className="flex flex-row-reverse flex-wrap gap-2.5 max-w-[80%] p-2.5 rounded-[10px_10px_1px_10px]">
            {message.urls.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`Image ${index + 1}`}
                className="block max-w-[40%] h-auto rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(url, "_blank")}
              />
            ))}
          </div>
        )}
        <div
          className="p-2.5 min-w-[150px] max-w-[80%] rounded-[10px_10px_1px_10px] break-words"
          style={{
            backgroundColor: theme.palette.primary.main,
            color: textColor
          }}
        >
          <div className="card-body p-0">
            <p className="whitespace-pre-wrap text-sm md:text-base">
              {message?.content}
            </p>
          </div>
        </div>
      </div>

      {message?.is_reset && <ResetHistoryLine />}
    </>
  );
});

const AssistantMessageCard = React.memo(
  ({
    message,
    theme,
    isError = false,
    handleFeedback = () => { },
    addMessage = () => { },
    sendEventToParentOnMessageClick
  }: any) => {
    const [isCopied, setIsCopied] = React.useState(false);
    const handleCopy = () => {
      copy(message?.chatbot_message || message?.content);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    };

    const themePalette = {
      "--primary-main": lighten(theme.palette.secondary.main, 0.4),
    };

    const handleMsgInfoClick = () => {
        emitEventToParent("MESSAGE_CLICK", message)
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2.5 max-w-[90%] mb-2.5 animate-slide-left">
          <div className="flex flex-col items-center justify-end w-8">
            <div className="w-8 h8 rounded-full bg-primary/10 flex items-center justify-center">
              <Image
                src={AiIcon}
                width="28"
                height="28"
                alt="AI"
                style={{ color: "red" }}
              />
            </div>
          </div>

          {message?.wait ? (
            <div className="w-full">
              <p className="text-sm">{message?.content}</p>
              {/* <div className="flex gap-1 mt-2">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-200"></div>
              </div> */}
              <div className="loading-indicator" style={themePalette}>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
              </div>
            </div>
          ) : (
            <div className="min-w-[150px] max-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3" style={{ backgroundColor: theme.palette.background.default, }}>
              {message?.timeOut ? (
                <div className="flex items-center gap-2 text-error">
                  <AlertCircle className="w-4 h-4" />
                  <p>Timeout reached. Please try again later.</p>
                </div>
              ) : message.image_url ? (
                <div className="space-y-2">
                  <img
                    src={message.image_url}
                    alt="Message Image"
                    className="w-full max-h-[400px] min-h-[100px] rounded-lg object-cover"
                  />
                  <a
                    href={message.image_url}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-ghost btn-sm w-full text-primary"
                  >
                    <Maximize2 className="w-4 h-4 mr-2" />
                    View Full Image
                  </a>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {Object.keys(message?.tools_data || {})?.length > 0 && (
                    <Box className="flex items-center gap-2 mb-2">
                      <CircleCheckBig color="green" size={20} />
                      <p className="text-base text-green-900">
                        {Object.keys(message?.tools_data || {}).length} Functions executed
                      </p>
                    </Box>
                  )}
                  {(() => {
                    const parsedContent = isJSONString(
                      isError
                        ? message?.error
                        : message?.chatbot_message || message?.content
                    )
                      ? JSON.parse(
                        isError
                          ? message.error
                          : message?.chatbot_message || message?.content
                      )
                      : null;

                    if (
                      parsedContent &&
                      (parsedContent.hasOwnProperty("isMarkdown") ||
                        parsedContent.hasOwnProperty("response") ||
                        parsedContent.hasOwnProperty("components"))
                    ) {
                      return parsedContent.isMarkdown ||
                        parsedContent?.response ? (
                        <>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code: Code,
                              a: Anchor,
                            }}
                          >
                            {parsedContent?.markdown ||
                              JSON.stringify(parsedContent?.response)}
                          </ReactMarkdown>
                          {parsedContent?.options && (
                            <div className="flex flex-col gap-2 mt-4">
                              {parsedContent.options.map(
                                (option: any, index: number) => (
                                  <button
                                    key={index}
                                    onClick={() => addMessage(option)}
                                    className="btn btn-outline btn-sm"
                                  >
                                    {option}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <InterfaceGrid
                          inpreview={false}
                          ingrid={false}
                          gridId={parsedContent?.responseId || "default"}
                          loadInterface={false}
                          componentJson={parsedContent}
                          msgId={message?.createdAt}
                        />
                      );
                    }
                    return (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: Code,
                          a: Anchor,
                        }}
                      >
                        {!isError
                          ? message?.chatbot_message || message?.content
                          : message.error}
                      </ReactMarkdown>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-10">
          {!message?.wait && !message?.timeOut && !message?.error && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <button
                className="btn btn-ghost btn-xs tooltip"
                data-tip={isCopied ? "Copied!" : "Copy"}
                onClick={handleCopy}
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {message?.message_id && (
                <>
                  <button
                    className={`btn btn-ghost btn-xs tooltip ${message?.user_feedback === 1 ? "text-success" : ""
                      }`}
                    data-tip="Good response"
                    onClick={() =>
                      handleFeedback(
                        message?.message_id,
                        1,
                        message?.user_feedback
                      )
                    }
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>

                  <button
                    className={`btn btn-ghost btn-xs tooltip ${message?.user_feedback === 2 ? "text-error" : ""
                      }`}
                    data-tip="Bad response"
                    onClick={() =>
                      handleFeedback(
                        message?.message_id,
                        2,
                        message?.user_feedback
                      )
                    }
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>

              {  sendEventToParentOnMessageClick &&    <button
                    className={`btn btn-ghost btn-xs tooltip ${message?.user_feedback === 2 ? "text-error" : ""
                      }`}
                    data-tip="Message Info"
                    onClick={handleMsgInfoClick
                    }
                  >
                    <Info className="w-4 h-4" />
                  </button>}
                </>
              )}
            </div>
          )}
        </div>

        {message?.is_reset && <ResetHistoryLine />}
      </div>
    );
  }
);

const HumanOrBotMessageCard = React.memo(
  ({
    message,
    theme,
    isBot = false,
    isError = false,
    handleFeedback = () => { },
    addMessage = () => { },
  }: any) => {
    const [isCopied, setIsCopied] = React.useState(false);
    const handleCopy = () => {
      copy(message?.chatbot_message || message?.content);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    };

    return (
      <Box className="assistant_message_card">
        <Stack
          className="assistant-message-slide"
          sx={{
            alignItems: "flex-end",
            gap: "10px",
            maxWidth: "90%",
            "@media(max-width:479px)": {
              height: "fit-content",
              columnGap: "5px",
            },
            marginBottom: "10px",
          }}
          direction="row"
        >
          <Stack
            sx={{
              alignItems: "center",
              width: "30px",
              justifyContent: "flex-end",
              "@media(max-width:479px)": { width: "30px" },
            }}
            spacing="5px"
          >
            {!isBot ? (
              <img
                src={UserAssistant}
                width="28"
                height="28"
                alt="AI"
                style={{ color: "red" }}
              />
            ) : (
              <img
                width="24"
                height="24"
                src="https://img.icons8.com/ios/50/message-bot.png"
                alt="message-bot"
              />
            )}
          </Stack>

          <Box
            className="assistant-message-slide"
            sx={{
              backgroundColor: theme.palette.background.default,
              padding: "2px 10px",
              boxSizing: "border-box",
              height: "fit-content",
              minWidth: "150px",
              borderRadius: "10px 10px 10px 1px",
              boxShadow: "0 2px 1px rgba(0, 0, 0, 0.1)",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              maxWidth: "100%",
              color: "black",
              whiteSpace: "pre-wrap",
            }}
          >
            <Box className="assistant-message-slide">
              <div dangerouslySetInnerHTML={{ __html: message?.content }}></div>
            </Box>
          </Box>
        </Stack>
        <Box className="flex flex-row">
          <Box
            sx={{
              alignItems: "center",
              width: "30px",
              justifyContent: "flex-end",
              "@media(max-width:479px)": { width: "30px" },
            }}
          ></Box>
        </Box>
        {message?.is_reset && <ResetHistoryLine />}
      </Box>
    );
  }
);
function Message({ message, handleFeedback, addMessage }: any) {
  const theme = useTheme();
  const backgroundColor = theme.palette.primary.main;
  const textColor = isColorLight(backgroundColor) ? "black" : "white";
  const {sendEventToParentOnMessageClick} = useCustomSelector((state:$ReduxCoreType)=>({
    sendEventToParentOnMessageClick : state.Interface.eventsSubscribedByParent?.includes(ALLOWED_EVENTS_TO_SUBSCRIBE.MESSAGE_CLICK) || false
  }))
  return (
    <Box className="w-100">
      {message?.role === "user" ? (
        <>
          <UserMessageCard
            message={message}
            theme={theme}
            textColor={textColor}
          />
          {message?.error && (
            <AssistantMessageCard
              message={message}
              isError={true}
              theme={theme}
              textColor={textColor}
              handleFeedback={handleFeedback}
              addMessage={addMessage}
            />
          )}
        </>
      ) : message?.role === "assistant" ? (
        <AssistantMessageCard
          message={message}
          theme={theme}
          textColor={textColor}
          handleFeedback={handleFeedback}
          addMessage={addMessage}
          sendEventToParentOnMessageClick={sendEventToParentOnMessageClick}
        />
      ) : message?.role === "Human" ? (
        <HumanOrBotMessageCard
          message={message}
          theme={theme}
          textColor={textColor}
          handleFeedback={handleFeedback}
          addMessage={addMessage}
        />
      ) : message?.role === "Bot" ? (
        <HumanOrBotMessageCard
          message={message}
          theme={theme}
          isBot={true}
          textColor={textColor}
          handleFeedback={handleFeedback}
          addMessage={addMessage}
        />
      ) : message?.role === "tools_call" && Object.keys(message?.function) ? (
        <div className="flex items-center gap-2 pl-3">
          <div className="flex items-center justify-center w-[30px] sm:w-[30px]"></div>
          <CircleCheckBig color="green" size={20} />
          <p className="text-base text-green-900">
            {Object.keys(message?.function).length} Functions executed
          </p>
        </div>
      ) : message?.role === "reset" ? (
        <ResetHistoryLine text={message?.mode ? "Talk to human" : ""} />
      ) : null}
    </Box>
  );
}

export default React.memo(Message);
