// React and Next.js imports
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

// MUI Components
import { Box, LinearProgress, Typography } from "@mui/material";

// Third-party libraries
import InfiniteScroll from "react-infinite-scroll-component";

// App imports
import { $ReduxCoreType } from "@/types/reduxCore";
import { useCustomSelector } from "@/utils/deepCheckSelector";
import { MessageContext } from "./InterfaceChatbot";
import Message from "./Message";
import MoveToDownButton from "./MoveToDownButton";
import { ChatBotGif } from "@/assests/assestsIndex";
import { sendFeedbackAction } from "@/config/api";
import Image from "next/image";

interface MessageListProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

function MessageList({ containerRef, shouldScroll, setShouldScroll }: MessageListProps) {
  const {
    fetchMoreData,
    hasMoreMessages = false,
    setNewMessage,
    newMessage,
    currentPage = 1,
    starterQuestions = [],
  } = useContext(MessageContext);
  const MessagesList = useContext(MessageContext);
  const {
    messages = [],
    setMessages,
    addMessage,
    helloMessages = [],
  } = MessagesList;
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showIcon, setShowGif] = useState(false);
  const [isInverse, setIsInverse] = useState(false);
  const scrollPositionRef = useRef<number>(0);
  const prevMessagesLengthRef = useRef<number>(messages.length);
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
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);


  const handleScroll = useCallback(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const scrollPosition = currentContainer.scrollTop;
    const maxScrollTop = currentContainer.scrollHeight - currentContainer.clientHeight;

    // Save scroll position when scrolling up
    if (scrollPosition < scrollPositionRef.current) {
      scrollPositionRef.current = scrollPosition;
    }

    setShowScrollButton(scrollPosition < maxScrollTop - 150);

    // Trigger fetchMoreData when scrolled to top
    if (scrollPosition === 0 && hasMoreMessages) {
      fetchMoreData?.();
    }
  }, [containerRef, hasMoreMessages, fetchMoreData]);

  useEffect(() => {
    
    if (messages.length > prevMessagesLengthRef.current) {
      // New messages added at bottom
      if (shouldScroll || newMessage) {
        movetoDown();
      }
    } else if (messages.length > 0 && containerRef.current) {
      // Messages added at top (pagination)
      const heightDiff = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      containerRef.current.scrollTop = heightDiff - scrollPositionRef.current;
    }
    prevMessagesLengthRef.current = messages.length;
    setNewMessage?.(false);
  }, [messages, IsHuman, newMessage, shouldScroll]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll);
      return () => currentContainer.removeEventListener("scroll", handleScroll);
    }
  }, [containerRef, handleScroll]);

  const RenderMessages = useMemo(() => {
    const targetMessages = IsHuman ? helloMessages : messages;
    return targetMessages.map((message, index) => (
      <Message
        key={`${message?.message_id}-${index}`}
        message={message}
        handleFeedback={handleFeedback}
        addMessage={addMessage}
      />
    ));
  }, [messages, handleFeedback, addMessage, helloMessages, IsHuman]);

  useEffect(() => {
    const timer = setTimeout(() => setShowGif(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (IsHuman ? helloMessages.length === 0 : messages.length === 0) ? (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <Image
        src={ChatBotGif}
        alt="Chatbot GIF"
        style={{ display: showIcon ? "block" : "none" }}
        width={200}
        height={200}
      />
      <Typography variant="h6" color="black" fontWeight="bold" style={{ display: showIcon ? "block" : "none" }}>
        What can I help with?
      </Typography>

      {starterQuestions.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 2 }}>
          {starterQuestions.map((question, index) => (
            <Box
              key={index}
              onClick={() => addMessage(question)}
              sx={{ cursor: "pointer", marginBottom: 1, padding: 1, borderRadius: 2, border: "0.5px solid gray" }}
            >
              <Typography variant="body1" color="text.primary">
                {question}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  ) : (
    <Box
      id="scrollableDiv"
      sx={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: isInverse ? "column" : "column-reverse",
        padding: 2,
      }}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMoreData}
        hasMore={hasMoreMessages}
        inverse={!isInverse}
        loader={
          Number(currentPage) > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <LinearProgress
                sx={{ 
                  height: 4, 
                  width: "80%", 
                  marginBottom: 2,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'black'
                  }
                }}
              />
            </Box>
          )
        }
        scrollableTarget="message-container"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        scrollThreshold="230px"
      >
        {RenderMessages}
      </InfiniteScroll>

      <MoveToDownButton
        movetoDown={movetoDown}
        showScrollButton={showScrollButton}
      />
    </Box>
  );
}
export default MessageList;
