
// MUI Icons
import OpenSidebarIcon from "@/assests/OpenSidebar";
import ChatIcon from "@mui/icons-material/Chat";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SyncIcon from "@mui/icons-material/Sync";

// MUI Components
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

// Third-party libraries
import axios from "axios";
import React, { useContext } from "react";

// App imports
import { successToast } from "@/components/customToast";
import { performChatAction } from "@/config/api";
import { addUrlDataHoc } from "@/hoc/addUrlDataHoc";
import { $ReduxCoreType } from "@/types/reduxCore";
import { GetSessionStorageData } from "@/utils/ChatbotUtility";
import { useCustomSelector } from "@/utils/deepCheckSelector";
import { ParamsEnums } from "@/utils/enums";
import { isColorLight } from "@/utils/themeUtility";
import ChatbotDrawer from "./ChatbotDrawer";

// Styles
import "./InterfaceChatbot.css";
import { ChatbotContext } from "@/app/chatbot/layout";

function ChatbotHeader({ setLoading, setChatsLoading }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const {
    chatbotConfig: { chatbotTitle, chatbotSubtitle },
  } = useContext<any>(ChatbotContext);
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Grid
      item
      xs={12}
      className="first-grid"
      sx={{ paddingX: 1, paddingY: 1, background: theme.palette.primary.main }}
    >
      <Box className="flex-col-start-start">
        <Box className="flex-center-center">
          <Box
            color="inherit"
            className="mr-2 cursor-pointer flex-center"
            onClick={toggleDrawer(true)}
          >
            <OpenSidebarIcon color={textColor} />
          </Box>
          <Typography
            variant="h6"
            className="interface-chatbot__header__title"
            sx={{ color: textColor }}
          >
            {chatbotTitle || "AI Assistant"}
          </Typography>
          <ResetChatOption
            textColor={textColor}
            setChatsLoading={setChatsLoading}
          />
        </Box>
        {chatbotSubtitle && (
          <Typography
            variant="subtitle2"
            className="interface-chatbot__header__subtitle"
            sx={{ color: textColor }}
          >
            {chatbotSubtitle || "Do you have any questions? Ask us!"}
          </Typography>
        )}
      </Box>
      <ChatbotDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        setLoading={setLoading}
      />
    </Grid>
  );
}
export default ChatbotHeader;

export function ChatbotHeaderPreview() {
  const theme = useTheme();
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";

  return (
    <Grid
      item
      xs={12}
      className="first-grid"
      sx={{ paddingX: 2, paddingY: 1, background: theme.palette.primary.main }}
    >
      <Box className="flex-col-start-start">
        <Box className="flex-center-center">
          <Typography
            variant="h6"
            className="interface-chatbot__header__title flex-center-center"
            sx={{ color: textColor }}
          >
            AI Assistant
          </Typography>
          <ResetChatOption textColor={textColor} preview />
        </Box>
        <Typography
          variant="subtitle2"
          className="interface-chatbot__header__subtitle"
          sx={{ color: textColor }}
        >
          Do you have any questions? Ask us!
        </Typography>
      </Box>
    </Grid>
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
        <Box className="ml-2 flex-center-center">
          <KeyboardArrowDownIcon
            className="cursor-pointer"
            style={{ color: textColor }}
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

interface ChatbotFeedbackFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatbotFeedbackForm = React.memo(function ChatbotFeedbackForm({
  open,
  setOpen,
}: ChatbotFeedbackFormProps) {
  // const userId = localStorage.getItem("interfaceUserId");
  const userId = GetSessionStorageData("interfaceUserId");
  const handleClose = () => {
    setOpen(false);
  };
  const [feedback, setFeedback] = React.useState("");

  const sendFeedback = async () => {
    const feedbackUrl = process.env.REACT_APP_CHATBOT_FEEDBACK_URL;
    if (feedbackUrl) {
      // Send feedback to the backend
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
      <DialogTitle id="alert-dialog-title">Submit Chatbot Feedback</DialogTitle>
      <DialogContent>
        <DialogContentText color="black" className="mb-2">
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
        />

        {feedback?.length < 10 && (
          <Typography variant="caption" color="error">
            Minimum 10 charaters
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
