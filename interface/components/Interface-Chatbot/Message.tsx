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
  keyframes,
} from "@mui/material";
import copy from "copy-to-clipboard";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UserAssistant } from "../../../public/assestsIndex";
import isColorLight from "../../../utils/themeUtility.js";
import { isJSONString } from "../../utils/InterfaceUtils";
import InterfaceGrid from "../Grid/Grid";
import { Anchor, Code } from "./Interface-Markdown/MarkdownUtitily";
import Image from "next/image";
import { AiIcon } from "@/assests/assestsIndex";

const ResetHistoryLine = ({ text = "" }) => {
  return (
    <div className=" flex items-center justify-center w-full  border-gray-300 my-2">
      <div className="h-1 border-2 border-black w-full"></div>
      <span
        className={`px-2 py-1 text-lg font-medium rounded-full text-nowrap ${
          text ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {text || "History cleared"}
      </span>
      <div className="h-1 border-2 border-black w-full"></div>
    </div>
  );
};

const UserMessageCard = React.memo(({ message, theme, textColor }: any) => {
  return (
    <>
      <div className="flex flex-col items-end gap-2 w-full mb-2">
        {Array.isArray(message?.urls) && message.urls.length > 0 && (
          <div className="flex flex-row-reverse flex-wrap gap-2 max-w-[80%] p-2 rounded-lg">
            {message.urls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Image ${index + 1}`}
                className="block max-w-[40%] h-auto rounded-md cursor-pointer"
                onClick={() => window.open(url, "_blank")}
              />
            ))}
          </div>
        )}
        <div
          className="px-4 py-2 rounded-lg max-w-[80%] sm:max-w-[90%] break-words whitespace-pre-wrap shadow-md"
          style={{ backgroundColor: lighten(theme.palette.primary.main, 0.8) }}
        >
          <p className={`font-medium text-lg`}>{message?.content}</p>
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
    const dotPulse = keyframes`
    0% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0.3; transform: scale(1); }
  `;

    return (
      <div className="assistant_message_card my-4">
        <div className="flex flex-row items-end gap-2 max-w-[90%] mb-2 md:gap-4">
          <Image
            src={AiIcon}
            width={24}
            height={24}
            alt="AI"
            // className="w-20 h-20 object-contain"
          />

          {message?.wait ? (
            <div className="flex items-center gap-1 pl-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-[20px] h-[20px] rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    backgroundColor: theme.palette.primary.main,
                  }}
                ></div>
              ))}
            </div>
          ) : (
            <div className="p-2 min-w-[150px] rounded-lg break-words max-w-full text-lg shadow-sm text-black whitespace-pre-wrap">
              {message?.timeOut ? (
                <div className="flex items-start w-full gap-2 p-1">
                  <p>Timeout reached. Please try again later.</p>
                </div>
              ) : message.image_url ? (
                <div className="assistant-message-slide">
                  <div>
                    <Image
                      src={message.image_url}
                      alt="Message Image"
                      className="max-w-full min-w-[150px] max-h-[400px] min-h-[100px] rounded-lg"
                    />
                    <Button
                      href={message.image_url}
                      target="_blank"
                      download
                      variant="text"
                      className="block text-center"
                      style={{ color: theme.palette.primary.main }}
                    >
                      Full screen image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="assistant-message-slide">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message?.chatbot_message || message?.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
        {!message?.wait && !message?.timeOut && !message?.error && (
          <div className="flex flex-row ml-12 gap-2">
            <Tooltip title="Copy">
              {!isCopied ? (
                <ContentCopyIcon
                  fontSize="small"
                  className="cursor-pointer opacity-50"
                  onClick={handleCopy}
                />
              ) : (
                <FileDownloadDoneIcon
                  fontSize="small"
                  className="cursor-pointer text-green-500 opacity-70"
                />
              )}
            </Tooltip>
            {message?.message_id && (
              <>
                <Tooltip title="Good response">
                  {message?.user_feedback === 1 ? (
                    <ThumbUpIcon
                      fontSize="small"
                      className="cursor-pointer text-green-500 "
                      onClick={() =>
                        handleFeedback(
                          message?.message_id,
                          1,
                          message?.user_feedback
                        )
                      }
                    />
                  ) : (
                    <ThumbUpAltOutlinedIcon
                      fontSize="small"
                      className="cursor-pointer text-green-500 opacity-70"
                      onClick={() =>
                        handleFeedback(
                          message?.message_id,
                          1,
                          message?.user_feedback
                        )
                      }
                    />
                  )}
                </Tooltip>
                <Tooltip title="Bad response">
                  {message?.user_feedback === 2 ? (
                    <ThumbDownIcon
                      fontSize="small"
                      className="cursor-pointer text-red-500 "
                      onClick={() =>
                        handleFeedback(
                          message?.message_id,
                          2,
                          message?.user_feedback
                        )
                      }
                    />
                  ) : (
                    <ThumbDownOffAltOutlinedIcon
                      fontSize="small"
                      className="cursor-pointer text-red-500 opacity-70"
                      onClick={() =>
                        handleFeedback(
                          message?.message_id,
                          2,
                          message?.user_feedback
                        )
                      }
                    />
                  )}
                </Tooltip>
              </>
            )}
          </div>
        )}
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
              backgroundColor: lighten(theme.palette.primary.main, 0.8),
              padding: "4px 16px",
              boxSizing: "border-box",
              height: "fit-content",
              minWidth: "150px",
              borderRadius: "0px 8px 8px 8px",
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
