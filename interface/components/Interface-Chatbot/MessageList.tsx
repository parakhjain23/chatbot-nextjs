"use client";
import { Box, lighten, LinearProgress, Typography, useTheme } from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { sendFeedbackAction } from "../../../api/InterfaceApis/InterfaceApis";
import { ChatBotGif } from "../../../public/assestsIndex";
import { $ReduxCoreType } from "../../../types/reduxCore";
import { useCustomSelector } from "../../../utils/deepCheckSelector";
import { MessageContext } from "./InterfaceChatbot";
import Message from "./Message";
import MoveToDownButton from "./MoveToDownButton";
import Image from "next/image";
import isColorLight from "@/utils/themeUtility";

function MessageList() {
  const theme = useTheme();
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";
  const containerRef = useRef<any>(null);
  const {
    fetchMoreData,
    hasMoreMessages,
    setNewMessage,
    newMessage,
    currentPage,
    starterQuestions,
  } = useContext(MessageContext);
  const MessagesList: any = useContext(MessageContext);
  const {
    messages,
    setMessages,
    addMessage,
    helloMessages = [],
  } = MessagesList;
  const [showScrollButton, setShowScrollButton] = useState(false); // State to control the visibility of the button
  const [previousScrollHeight, setPreviousScrollHeight] = useState<
    number | null
  >(null);
  const [shouldScroll, setShouldScroll] = useState(true);
  const [showIcon, setShowGif] = useState(false);
  const [isInverse, setIsInverse] = useState(false);
  const { IsHuman } = useCustomSelector((state: $ReduxCoreType) => ({
    IsHuman: state.Hello?.isHuman,
  }));

  const handleFeedback = useCallback(
    async (
      messageId: string,
      feedbackStatus: number,
      currentStatus: number
    ) => {
      if (messageId && feedbackStatus && currentStatus !== feedbackStatus) {
        setShouldScroll(false);
        const response: any = await sendFeedbackAction({
          messageId,
          feedbackStatus,
        });
        if (response?.success) {
          const messageId = response?.result?.[0]?.message_id;
          // Iterate over messages and update the feedback status of the message whose role is assistant
          for (let i = messages?.length - 1; i >= 0; i--) {
            const message = messages[i];
            if (
              message?.role === "assistant" &&
              message?.message_id === messageId
            ) {
              message.user_feedback = feedbackStatus;
              break; // Assuming only one message needs to be updated
            }
          }
          setMessages([...messages]);
        }
      }
    },
    [messages, setMessages, sendFeedbackAction]
  );

  const movetoDown = useCallback(() => {
    containerRef.current?.scrollTo({
      top: containerRef?.current?.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const handleScroll = useCallback(() => {
    const currentContainer = containerRef?.current;
    const scrollPosition = currentContainer?.scrollTop;
    const maxScrollTop =
      currentContainer?.scrollHeight - currentContainer?.clientHeight;

    // Show the button if scrolled up
    if (scrollPosition < maxScrollTop - 150) {
      setShowScrollButton(true);
    }

    // Hide the button if scrolled all the way to the bottom
    if (maxScrollTop - scrollPosition < maxScrollTop + 250) {
      setShowScrollButton(false);
    }
  }, []);

  useEffect(() => {
    if (shouldScroll || newMessage) {
      movetoDown();
    }
    if (setNewMessage) {
      setNewMessage(false);
    }
    setShouldScroll(true);
  }, [messages, movetoDown, helloMessages, IsHuman, newMessage]);

  // Update scroll position when messages change
  useEffect(() => {
    const currentContainer = containerRef?.current;
    if (currentContainer) {
      const contentHeight = currentContainer?.scrollHeight;
      const containerHeight = currentContainer?.clientHeight;

      setIsInverse(contentHeight <= containerHeight);
    }
  }, [messages]);

  useEffect(() => {
    const currentContainer = containerRef?.current;
    if (currentContainer) {
      const newScrollHeight = currentContainer?.scrollHeight;
      if (previousScrollHeight !== null) {
        currentContainer.scrollTop += newScrollHeight - previousScrollHeight;
      }
      setPreviousScrollHeight(newScrollHeight);
    }

    currentContainer?.addEventListener("scroll", handleScroll);
    return () => {
      currentContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [messages, handleScroll]);

  const RenderMessages = useMemo(() => {
    if (IsHuman) {
      return helloMessages?.map((message, index) => (
        <Message
          key={`${message?.message_id}-${index}`} // Combine message_id with index to ensure uniqueness
          message={message}
          handleFeedback={handleFeedback}
          addMessage={addMessage}
        />
      ));
    }
    return messages?.map((message, index) => (
      <Message
        key={`${message?.message_id}-${index}`} // Combine message_id with index to ensure uniqueness
        message={message}
        handleFeedback={handleFeedback}
        addMessage={addMessage}
      />
    ));
  }, [messages, handleFeedback, addMessage, helloMessages, IsHuman]); // Include handleFeedback in dependencies

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGif(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGif(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (IsHuman ? helloMessages?.length === 0 : messages?.length === 0) ? (
    <div className="flex flex-col justify-center items-center h-full">
      <Image
        src={ChatBotGif}
        alt="Chatbot GIF"
        className={showIcon ? "block" : "hidden"}
      />
      <p className={`font-bold text-lg ${showIcon ? "block" : "hidden"}`}>
        What can I help with?
      </p>

      {starterQuestions?.length > 0 && (
        <div className="flex flex-col items-center mt-2">
          {starterQuestions?.map((question, index) => (
            <div
              key={index}
              onClick={() => addMessage(question)}
              className={`cursor-pointer mb-1 p-2 rounded-md  border-[0.5px] border-black`}
            >
              <p className="text-base">
                {question}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="flex justify-center h-full">
      <div
        id="scrollableDiv"
        className={` h-full overflow-y-auto flex w-full max-w-[900px] ${isInverse ? "flex-col" : "flex-col-reverse"
          } p-2`}
        ref={containerRef}
        onScroll={handleScroll}
      >
        <InfiniteScroll
          dataLength={messages?.length}
          next={fetchMoreData}
          hasMore={hasMoreMessages}
          inverse
          loader={
            currentPage > 1 && (
              <div className="flex justify-center">
                <div className="w-4/5 mb-2 h-1 bg-secondary animate-pulse" />
              </div>
            )
          }
          scrollableTarget="scrollableDiv"
          style={{ display: "flex", flexDirection: "column" }}
          scrollThreshold="230px"
        >
          {RenderMessages}
        </InfiniteScroll>

        {/* MoveToDownButton inside relative container */}
        <MoveToDownButton
          movetoDown={movetoDown}
          showScrollButton={showScrollButton}
        />
      </div>
    </div>
  );
}
export default MessageList;
