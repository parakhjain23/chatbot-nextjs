// React and Next.js imports
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
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

function MessageList() {
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
    setNewMessage(false);
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
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (IsHuman ? helloMessages.length === 0 : messages.length === 0) ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <img
        src={ChatBotGif}
        alt="Chatbot GIF"
        style={{ display: showIcon ? "block" : "none" }}
      />
      <Typography
        variant="h6"
        color="black"
        fontWeight="bold"
        style={{ display: showIcon ? "block" : "none" }}
      >
        What can I help with?
      </Typography>

      {starterQuestions.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          {starterQuestions.map((question, index) => (
            <Box
              key={index}
              onClick={() => addMessage(question)}
              sx={{
                cursor: "pointer",
                marginBottom: 1,
                padding: 1,
                borderRadius: 2,
                border: "0.5px solid gray",
              }}
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
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <LinearProgress
                color="secondary"
                sx={{ height: 4, width: "80%", marginBottom: 2 }}
              />
            </Box>
          )
        }
        scrollableTarget="scrollableDiv"
        style={{
          display: "flex",
          // flexDirection: isInverse ? "column" : "column-reverse",
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
