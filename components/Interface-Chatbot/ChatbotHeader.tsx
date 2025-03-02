// MUI Icons
import OpenSidebarIcon from "@/assests/OpenSidebar";
import ChatIcon from "@mui/icons-material/Chat";
import SyncIcon from "@mui/icons-material/Sync";

// MUI Components
import {
  useTheme
} from "@mui/material";

// Third-party libraries
import axios from "axios";
import React, { useContext } from "react";

// App imports
import { successToast } from "@/components/customToast";
import { performChatAction } from "@/config/api";
import { addUrlDataHoc } from "@/hoc/addUrlDataHoc";
import { $ReduxCoreType } from "@/types/reduxCore";
import { GetSessionStorageData, toggleSidebar } from "@/utils/ChatbotUtility";
import { useCustomSelector } from "@/utils/deepCheckSelector";
import { ParamsEnums } from "@/utils/enums";
import { isColorLight } from "@/utils/themeUtility";
import ChatbotDrawer from "./ChatbotDrawer";

// Styles
import { ChevronDown } from "lucide-react";
import { ChatbotContext } from "../AppWrapper";
import "./InterfaceChatbot.css";

function ChatbotHeader({ setLoading, setChatsLoading }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const {
    chatbotConfig: { chatbotTitle, chatbotSubtitle },
  } = useContext<any>(ChatbotContext);
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";

  const toggleDrawer = (newOpen: boolean) => () => {
    // setOpen(newOpen);
    toggleSidebar("main-sidebar")
  };

  return (
    <div className="navbar shadow-lg" style={{ background: theme.palette.primary.main }}>
      <div className="flex-1">
        <button
          className="btn btn-ghost btn-circle"
          onClick={toggleDrawer(true)}
          style={{ color: textColor }}
        >
          <OpenSidebarIcon color={textColor} />
        </button>
        <div className="flex flex-col" style={{ color: textColor }}>
          <h2 className="text-xl font-bold" style={{ color: textColor }}>
            {chatbotTitle || "AI Assistant"}
          </h2>
          {chatbotSubtitle && (
            <p className="text-sm opacity-75" style={{ color: textColor }}>
              {chatbotSubtitle || "Do you have any questions? Ask us!"}
            </p>
          )}
        </div>
      </div>
      <div className="flex-none">
        <ResetChatOption
          textColor={textColor}
          setChatsLoading={setChatsLoading}
        />
      </div>
      {/* <ChatbotDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        setLoading={setLoading}
      /> */}
    </div>
  );
}

export default ChatbotHeader;

export function ChatbotHeaderPreview() {
  const theme = useTheme();
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";

  return (
    <div className="navbar bg-base-100 shadow-lg rounded-box">
      <div className="flex-1">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">AI Assistant</h2>
          <p className="text-sm opacity-75">
            Do you have any questions? Ask us!
          </p>
        </div>
      </div>
      <div className="flex-none">
        <ResetChatOption textColor={textColor} preview />
      </div>
    </div>
  );
}

const ResetChatOption = React.memo(
  addUrlDataHoc(
    ({
      textColor,
      setChatsLoading = () => { },
      preview = false,
      chatbotId,
    }) => {
      const [modalOpen, setModalOpen] = React.useState(false);
      const { threadId, bridgeName, IsHuman, subThreadId } = useCustomSelector(
        (state: $ReduxCoreType) => ({
          threadId: state.Interface?.threadId || "",
          subThreadId: state.Interface?.subThreadId || "",
          bridgeName: state.Interface?.bridgeName || "root",
          IsHuman: state.Hello?.isHuman,
        })
      );
      const userId = GetSessionStorageData("interfaceUserId");
      const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
      const open = Boolean(anchorEl);

      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = async () => {
        setAnchorEl(null);
      };

      const resetHistory = async () => {
        if (preview) return;
        setChatsLoading(true);
        await performChatAction({
          userId,
          thread_id: threadId,
          slugName: bridgeName,
          chatBotId: chatbotId,
          sub_thread_id: subThreadId,
          purpose: "is_reset",
        });
        handleClose();
        setChatsLoading(false);
      };

      return (
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost btn-circle" onClick={handleClick}>
            <ChevronDown className="h-5 w-5" color={textColor} />
          </button>
          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <button
                onClick={resetHistory}
                disabled={IsHuman}
                className="flex items-center gap-2"
              >
                <SyncIcon className="h-4 w-4" />
                Reset Chat
              </button>
            </li>
            <li>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2"
              >
                <ChatIcon className="h-4 w-4" />
                Send feedback
              </button>
            </li>
          </ul>
          {modalOpen && (
            <ChatbotFeedbackForm open={modalOpen} setOpen={setModalOpen} />
          )}
        </div>
      );
    },
    [ParamsEnums.chatbotId]
  )
);

interface ChatbotFeedbackFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatbotFeedbackForm = React.memo(function ChatbotFeedbackForm({
  open,
  setOpen,
}: ChatbotFeedbackFormProps) {
  const userId = GetSessionStorageData("interfaceUserId");
  const handleClose = () => {
    setOpen(false);
  };
  const [feedback, setFeedback] = React.useState("");

  const sendFeedback = async () => {
    const feedbackUrl = process.env.REACT_APP_CHATBOT_FEEDBACK_URL;
    if (feedbackUrl) {
      await axios.post(feedbackUrl, { message: feedback, userId });
      successToast("Feedback submitted successfully!");
      setFeedback("");
      handleClose();
    }
  };

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Submit Chatbot Feedback</h3>
        <p className="py-4">
          We value your feedback on our chatbot! Please share your thoughts to
          help us improve your experience.
        </p>
        <textarea
          className="textarea textarea-bordered w-full h-40"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
        />
        {feedback?.length < 10 && (
          <p className="text-error text-sm mt-1">
            Minimum 10 characters required
          </p>
        )}
        <div className="modal-action">
          <button className="btn" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={sendFeedback}
            disabled={feedback?.length < 10}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
});
