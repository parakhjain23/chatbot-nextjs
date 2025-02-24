"use client";
import ChatIcon from "@mui/icons-material/Chat";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SyncIcon from "@mui/icons-material/Sync";
import CreateIcon from "@mui/icons-material/Create";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import {
  performChatAction,
  createNewThreadApi,
} from "../../../api/InterfaceApis/InterfaceApis";
import { ChatbotContext } from "../../../app/layout";
import { successToast } from "../../../components/customToast";
import { ParamsEnums } from "../../../enums";
import addUrlDataHoc from "../../../hoc/addUrlDataHoc";
import { $ReduxCoreType } from "../../../types/reduxCore";
import { useCustomSelector } from "../../../utils/deepCheckSelector";
import isColorLight from "../../../utils/themeUtility";
import { GetSessionStorageData } from "../../utils/InterfaceUtils";
import ChatbotDrawer from "./ChatbotDrawer";
import OpenSidebarIcon from "../../../public/OpenSidebar";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import {
  setThreadId,
  setThreads,
} from "../../../store/interface/interfaceSlice";
import { X } from "lucide-react";

const createRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

const previewNewThread = () => {
  console.log("Previewing new thread before creation");
};

function ChatbotHeader({ setLoading, setChatsLoading }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const {
    chatbotConfig: { chatbotTitle, chatbotSubtitle, hideCloseButton },
    toggleHideCloseButton,
  } = useContext<any>(ChatbotContext);

  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";

  const { reduxThreadId, reduxBridgeName } = useCustomSelector(
    (state: $ReduxCoreType) => ({
      reduxThreadId: state.Interface?.threadId || "",
      reduxBridgeName:
        GetSessionStorageData("bridgeName") ||
        state.Interface?.bridgeName ||
        "root",
    })
  );

  const thread_id = GetSessionStorageData("threadId") || reduxThreadId;

  const handleCreateNewSubThread = async () => {
    previewNewThread();
    const result = await createNewThreadApi({
      threadId: thread_id,
      subThreadId: createRandomId(),
    });
    if (result?.success) {
      dispatch(
        setThreads({
          newThreadData: result.thread,
          bridgeName: GetSessionStorageData("bridgeName") || reduxBridgeName,
          threadId: thread_id,
        }) as any
      );
      setOpen(false);
    }
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div
      className="px-4 py-4 shadow-lg"
      style={{ background: theme.palette.primary.main }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2">
          <div
            className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
            onClick={toggleDrawer(true)}
          >
            <OpenSidebarIcon color={textColor} />
          </div>
          <button
            onClick={handleCreateNewSubThread}
            className=""
            style={{ color: textColor }}
          >
            <CreateIcon className="text-sm" />
          </button>
        </div>
        <h6
          className="font-semibold text-xl uppercase flex-grow text-center"
          style={{ color: textColor }}
        >
          {chatbotTitle || "AI Assistant"}
        </h6>
        <div className="flex">
          <div className="flex justify-end">
            <ResetChatOption
              textColor={textColor}
              setChatsLoading={setChatsLoading}
            />
          </div>
        </div>
        {!hideCloseButton && (
          <div>
            <X onClick={toggleHideCloseButton} color={textColor} />
          </div>
        )}
      </div>

      {/* {chatbotSubtitle && ( */}
      <p
        className="font-normal mt-1 italic text-center"
        style={{ color: textColor }}
      >
        {chatbotSubtitle || "Do you have any questions? Ask us!"}
      </p>
      {/* )} */}

      <ChatbotDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        setLoading={setLoading}
      />
    </div>
  );
}

export default ChatbotHeader;

export function ChatbotHeaderPreview() {
  const theme = useTheme();
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";

  return (
    <div
      className="px-3 py-2 shadow-md rounded-none w-full"
      style={{ background: theme.palette.primary.main }}
    >
      <div className="flex flex-col items-start">
        <div className="flex items-center">
          <h6
            className=" font-semibold text-xl uppercase"
            style={{ color: textColor }}
          >
            AI Assistant
          </h6>
          <ResetChatOption textColor={textColor} preview />
        </div>
        <p className=" font-normal mt-1 italic" style={{ color: textColor }}>
          Do you have any questions? Ask us!
        </p>
      </div>
    </div>
  );
}

const ResetChatOption = React.memo(
  addUrlDataHoc(
    ({
      textColor,
      setChatsLoading = () => {},
      preview = false,
      interfaceId,
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
          chatBotId: interfaceId,
          sub_thread_id: subThreadId,
          purpose: "is_reset",
        });
        handleClose();
        setChatsLoading(false);
      };

      return (
        <Box sx={{ marginLeft: 2, display: "flex", alignItems: "center" }}>
          <GridMoreVertIcon
            sx={{
              cursor: "pointer",
              color: textColor,
            }}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={resetHistory} disabled={IsHuman}>
              <ListItemIcon>
                <SyncIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reset Chat</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setModalOpen(true)}>
              <ListItemIcon>
                <ChatIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Send feedback</ListItemText>
            </MenuItem>
          </Menu>
          {modalOpen && (
            <ChatbotFeedbackForm open={modalOpen} setOpen={setModalOpen} />
          )}
        </Box>
      );
    },
    [ParamsEnums.interfaceId]
  )
);

const ChatbotFeedbackForm = React.memo(function ChatbotFeedbackForm({
  open,
  setOpen,
}: ChatbotFeedbackFormProps) {
  const theme = useTheme();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const userId = GetSessionStorageData("interfaceUserId");
  const handleClose = () => {
    setOpen(false);
  };
  const [feedback, setFeedback] = React.useState("");

  const sendFeedback = async () => {
    const feedbackUrl = process.env.NEXT_PUBLIC_CHATBOT_FEEDBACK_URL;
    if (feedbackUrl) {
      await axios.post(feedbackUrl, { message: feedback, userId });
      successToast("Feedback submitted successfully!");
      setFeedback("");
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontWeight: "bold" }}>
        Submit Chatbot Feedback
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 2 }}>
          We value your feedback on our chatbot! Please share your thoughts to
          help us improve your experience.
        </DialogContentText>
        <TextField
          multiline
          fullWidth
          minRows={10}
          maxRows={10}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value || "")}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              borderColor: theme.palette.grey[300],
            },
          }}
        />
        {feedback?.length < 10 && (
          <Typography variant="caption" color="error">
            Minimum 10 characters
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={sendFeedback}
          autoFocus
          disabled={feedback?.length < 10}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
});
