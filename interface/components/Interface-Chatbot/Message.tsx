/* eslint-disable */
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import {
  Box,
  Button,
  Chip,
  Divider,
  lighten,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import copy from "copy-to-clipboard";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AiIcon, UserAssistant } from "../../../public/assestsIndex";
import isColorLight from "../../../utils/themeUtility.js";
import { isJSONString } from "../../utils/InterfaceUtils";
import InterfaceGrid from "../Grid/Grid";
import { Anchor, Code } from "./Interface-Markdown/MarkdownUtitily";
import Image from "next/image";

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
      <Stack
        className="user-message-slide"
        sx={{
          alignItems: "flex-end",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          justifyContent: "flex-end",
          "@media(max-width:479px)": {
            height: "fit-content",
            columnGap: "5px",
          },
          marginBottom: "10px",
        }}
        direction="row"
      >
        {Array.isArray(message?.urls) && message.urls.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              flexWrap: "wrap",
              gap: "10px",
              maxWidth: "80%",
              padding: "10px",
              boxSizing: "border-box",
              borderRadius: "10px 10px 1px 10px",
            }}
          >
            {message.urls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Image ${index + 1}`}
                style={{
                  display: "block",
                  maxWidth: "40%",
                  height: "auto",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => window.open(url, "_blank")}
              />
            ))}
          </Box>
        )}
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            padding: "10px",
            boxSizing: "border-box",
            height: "fit-content",
            minWidth: "150px",
            borderRadius: "10px 10px 1px 10px",
            wordBreak: "break-word",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            maxWidth: "80%",
            //  boxShadow: "0 4px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              // fontFamily: "var(--theme-font-family)",
              color: textColor,
              whiteSpace: "pre-wrap",
              // fontSize: "15px",
              // "@media(max-width:991px)": { fontSize: "14px" },
              // "@media(max-width:479px)": { fontSize: "12px" },
            }}
          >
            {message?.content}
          </Typography>
        </Box>
      </Stack>
      {message?.is_reset && <ResetHistoryLine />}
    </>
  );
});

const AssistantMessageCard = React.memo(
  ({
    message,
    theme,
    isError = false,
    handleFeedback = () => {},
    addMessage = () => {},
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
            <Image
              src={AiIcon}
              width="28"
              height="28"
              alt="AI"
              style={{ color: "red" }}
            />
          </Stack>
          {message?.wait && (
            <div className="w-100">
              <Typography variant="subtitle2">{message?.content}</Typography>
              <div className="loading-indicator" style={themePalette}>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
              </div>
            </div>
          )}
          {!message?.wait && (
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
              {message?.timeOut ? (
                <Box className="flex-start-center w-100 gap-5 p-1">
                  <Typography variant="body1">
                    Timeout reached. Please try again later.
                  </Typography>
                </Box>
              ) : message.image_url ? (
                <Box className="assistant-message-slide">
                  <div>
                    <Image
                      src={message.image_url}
                      alt="Message Image"
                      style={{
                        maxWidth: "100%",
                        minWidth: "150px",
                        maxHeight: "400px",
                        minHeight: "100px",
                        borderRadius: "10px",
                      }}
                    />
                    <Button
                      href={message.image_url}
                      target="_blank"
                      download
                      variant="text"
                      sx={{
                        display: "block",
                        textAlign: "center",
                        color: theme.palette.primary.main,
                        textDecoration: "none",
                      }}
                    >
                      Full screen image
                    </Button>
                  </div>
                </Box>
              ) : (
                <Box className="assistant-message-slide">
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
                            <Box className="flex flex-col gap-1">
                              {parsedContent.options.map(
                                (option: any, index: number) => (
                                  <Button
                                    key={index}
                                    className="option-button mr-2 cursor-pointer"
                                    variant="outlined"
                                    onClick={() => addMessage(option)}
                                  >
                                    {option}
                                  </Button>
                                )
                              )}
                            </Box>
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
                </Box>
              )}
            </Box>
          )}
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
          {/* Icon box that will show on hover of the message card */}
          {!message?.wait && !message?.timeOut && !message?.error && (
            <Box className="icon-box flex flex-row ml-2 gap-1 hover-and-see">
              <Tooltip title="Copy">
                {!isCopied ? (
                  <ContentCopyIcon
                    fontSize="inherit"
                    sx={{ fontSize: "16px" }}
                    onClick={handleCopy}
                    className="cursor-pointer"
                  />
                ) : (
                  <FileDownloadDoneIcon
                    fontSize="inherit"
                    sx={{ fontSize: "16px" }}
                    color="success"
                    className="cursor-pointer"
                  />
                )}
              </Tooltip>
              {message?.message_id && (
                <>
                  <Tooltip title="Good response">
                    {message?.user_feedback === 1 ? (
                      <ThumbUpIcon
                        fontSize="inherit"
                        sx={{
                          fontSize: "16px",
                          color: "green",
                        }}
                        onClick={() =>
                          handleFeedback(
                            message?.message_id,
                            1,
                            message?.user_feedback
                          )
                        }
                        className="cursor-pointer"
                      />
                    ) : (
                      <ThumbUpAltOutlinedIcon
                        fontSize="inherit"
                        sx={{
                          "&:hover": { color: "green" },
                          fontSize: "16px",
                          color: "inherit",
                        }}
                        onClick={() =>
                          handleFeedback(
                            message?.message_id,
                            1,
                            message?.user_feedback
                          )
                        }
                        className="cursor-pointer"
                      />
                    )}
                  </Tooltip>
                  <Tooltip title="Bad response">
                    {message?.user_feedback === 2 ? (
                      <ThumbDownIcon
                        fontSize="inherit"
                        sx={{
                          color: "red",
                          fontSize: "16px",
                        }}
                        onClick={() =>
                          handleFeedback(
                            message?.message_id,
                            2,
                            message?.user_feedback
                          )
                        }
                        className="cursor-pointer"
                      />
                    ) : (
                      <ThumbDownOffAltOutlinedIcon
                        fontSize="inherit"
                        sx={{ "&:hover": { color: "red" }, fontSize: "16px" }}
                        onClick={() =>
                          handleFeedback(
                            message?.message_id,
                            2,
                            message?.user_feedback
                          )
                        }
                        className="cursor-pointer"
                      />
                    )}
                  </Tooltip>
                </>
              )}
            </Box>
          )}
        </Box>
        {message?.is_reset && <ResetHistoryLine />}
      </Box>
    );
  }
);

const HumanOrBotMessageCard = React.memo(
  ({
    message,
    theme,
    isBot = false,
    isError = false,
    handleFeedback = () => {},
    addMessage = () => {},
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
              <Image
                src={UserAssistant}
                width="28"
                height="28"
                alt="AI"
                style={{ color: "red" }}
              />
            ) : (
              <Image
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
        <Box className="flex gap-2 mb-2">
          <Stack
            sx={{
              alignItems: "center",
              width: "30px",
              justifyContent: "flex-end",
              "@media(max-width:479px)": { width: "30px" },
            }}
            spacing="5px"
          ></Stack>
          <CheckCircleIcon color="success" />
          <Typography>
            {Object.keys(message?.function).length} Functions executed
          </Typography>
        </Box>
      ) : message?.role === "reset" ? (
        <ResetHistoryLine text={message?.mode ? "Talk to human" : ""} />
      ) : null}
    </Box>
  );
}

export default React.memo(Message);
