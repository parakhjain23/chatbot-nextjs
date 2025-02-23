"use client";
import ChatIcon from "@mui/icons-material/Chat";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SyncIcon from "@mui/icons-material/Sync";
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
import { performChatAction } from "../../../api/InterfaceApis/InterfaceApis";
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
      sx={{
        paddingX: 3,
        paddingY: 2,
        backgroundColor: theme.palette.primary.main,
        borderRadius: 0,
        boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1)`,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Box display="flex" alignItems="center">
          <Box
            color="inherit"
            sx={{
              cursor: "pointer",
              marginRight: 2,
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
            onClick={toggleDrawer(true)}
          >
            <OpenSidebarIcon color={textColor} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: textColor,
              fontWeight: 600,
              fontSize: "1.25rem",
              textTransform: "uppercase",
            }}
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
            sx={{
              color: textColor,
              fontWeight: 400,
              marginTop: 0.5,
              fontStyle: "italic",
            }}
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
      sx={{
        paddingX: 3,
        paddingY: 2,
        backgroundColor: theme.palette.primary.main,
        borderRadius: 0,
        boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1)`,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Box display="flex" alignItems="center">
          <Typography
            variant="h6"
            sx={{
              color: textColor,
              fontWeight: 600,
              fontSize: "1.25rem",
              textTransform: "uppercase",
            }}
          >
            AI Assistant
          </Typography>
          <ResetChatOption textColor={textColor} preview />
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: textColor,
            fontWeight: 400,
            marginTop: 0.5,
            fontStyle: "italic",
          }}
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
        <Box sx={{ marginLeft: 2, display: "flex", alignItems: "center" }}>
          <KeyboardArrowDownIcon
            sx={{
              cursor: "pointer",
              color: textColor,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
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
            borderRadius: 1,
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
