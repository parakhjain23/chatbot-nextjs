"use client";
/* eslint-disable */
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AiIcon, UserAssistant } from "../../../public/assestsIndex";
import { setHuman } from "../../../store/hello/helloSlice";
import { $ReduxCoreType } from "../../../types/reduxCore";
import { useCustomSelector } from "../../../utils/deepCheckSelector";
import isColorLight from "../../../utils/themeUtility";
import { MessageContext } from "./InterfaceChatbot";
import { uploadImage } from "../../../api/InterfaceApis/InterfaceApis";
import { errorToast } from "../../../components/customToast";
import Image from "next/image";

interface ChatbotTextFieldType {
  onSend?: any;
  loading?: boolean;
  messageRef?: any;
  disabled?: boolean;
  options?: any[];
  setChatsLoading?: any;
  images?: string[];
  setImages?: React.Dispatch<React.SetStateAction<string[]>>;
}
function ChatbotTextField({
  onSend = () => {},
  loading,
  messageRef,
  disabled = false,
  options = [],
  setChatsLoading = () => {},
  images = [],
  setImages = () => {},
}: ChatbotTextFieldType) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isLight = isColorLight(theme.palette.primary.main);
  const [anchorEl, setAnchorEl] = useState(null);
  const isPopoverOpen = Boolean(anchorEl);
  const { IsHuman, mode } = useCustomSelector((state: $ReduxCoreType) => ({
    IsHuman: state.Hello?.isHuman,
    mode: state.Hello?.mode || [],
  }));
  const isHelloAssistantEnabled = mode?.length > 0 && mode?.includes("human");
  const reduxIsVision = useCustomSelector(
    (state: $ReduxCoreType) => state.Interface?.isVision || ""
  );
  const MessagesList: any = useContext(MessageContext);
  const { addMessage } = MessagesList;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && !loading && !isUploading) {
      event.preventDefault();
      onSend({ Message: message, images: images });
    }
  };

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event?.data?.type === "open") {
      messageRef?.current?.focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  const handlePopoverOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const EnableHumanAgent = async () => {
    setChatsLoading(true);
    dispatch(setHuman({}));
    setChatsLoading(false);
  };

  const EnableAI = async () => {
    setChatsLoading(true);
    dispatch(setHuman({ isHuman: false }));
    setChatsLoading(false);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setIsUploading(true);
      try {
        for (const file of filesArray) {
          if (images.length > 4) {
            errorToast("You have uploaded more than 4 images.");
          }
          const formData = new FormData();
          formData.append("image", file);
          const response = await uploadImage({ formData });
          if (response.success) {
            setImages((prev) => [...prev, response.image_url]);
          }
        }
        if (filesArray.length > 4) {
          errorToast("You have uploaded more than 4 images.");
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{ position: "relative", width: "100%" }}
      className="border-2 h-[150px] shadow-md rounded-md"
    >
      {options && options.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: theme.spacing(1),
            flexWrap: "wrap",
            padding: theme.spacing(1),
            animation: "fadeIn 0.5s ease-in-out",
            "@keyframes fadeIn": {
              "0%": { opacity: 0 },
              "100%": { opacity: 1 },
            },
          }}
        >
          {options?.slice(0, 3).map((option, index) => (
            <Box
              key={index}
              onClick={() => addMessage(option)}
              className="border-p5 p-2 cursor-pointer flex-center-center"
              sx={{
                borderRadius: 7,
                boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="caption">{option}</Typography>
            </Box>
          ))}
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(1),
          flexWrap: "wrap",
          gap: theme.spacing(1),
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              maxWidth: "20%",
              maxHeight: "50px",
              borderRadius: "5px",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px",
            }}
          >
            <Image
              src={image}
              alt={`Uploaded Preview ${index + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: "5px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: -2,
                right: -2,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={() => handleRemoveImage(index)}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }}
              >
                ✕
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <TextField
        inputRef={messageRef}
        className="input-field"
        multiline
        maxRows={8}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your message"
        fullWidth
        focused
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box
                sx={{
                  display: "flex",
                  position: "relative",
                  marginLeft: theme.spacing(
                    (reduxIsVision?.vision && mode?.includes("human")) ||
                      (reduxIsVision?.vision && !mode?.includes("human"))
                      ? 5
                      : 1
                  ),
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "28px",
                    height: "28px",
                    "& > *": {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transition: "opacity 0.2s ease-in-out",
                    },
                    ...(isHelloAssistantEnabled && {
                      "& > .icon-visible": {
                        opacity: 1,
                      },
                      "& > .icon-hidden": {
                        opacity: 0,
                      },
                      "&:hover > .icon-visible": {
                        opacity: 0,
                      },
                      "&:hover > .icon-hidden": {
                        opacity: 1,
                      },
                    }),
                  }}
                  onClick={isHelloAssistantEnabled ? handlePopoverOpen : null}
                >
                  <Image
                    src={IsHuman ? UserAssistant : AiIcon}
                    width="28"
                    height="28"
                    alt="AI"
                    className="icon-visible"
                    style={{
                      cursor: "pointer",
                      filter: !IsHuman ? "drop-shadow(0 0 5px pink)" : "",
                    }}
                  />
                  {isHelloAssistantEnabled && (
                    <ExpandLessIcon
                      className="icon-hidden"
                      sx={{ fontSize: "28px", cursor: "pointer" }}
                    />
                  )}
                </Box>
                <Popover
                  open={isPopoverOpen}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  sx={{
                    "& .MuiPopover-paper": {
                      display: "flex",
                      flexDirection: "column",
                      padding: 2,
                    },
                  }}
                >
                  <Button
                    onClick={() => {
                      EnableAI();
                      handlePopoverClose();
                    }}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <Image
                      src={AiIcon}
                      width="30"
                      height="30"
                      alt="AI Icon"
                      style={{
                        marginRight: 8,
                        filter: "drop-shadow(0 0 5px pink)",
                      }}
                    />
                    <Typography variant="body1" color="black">
                      AI
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      EnableHumanAgent();
                      handlePopoverClose();
                    }}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <Image
                      src={UserAssistant}
                      width="30"
                      height="30"
                      alt="AI Icon"
                      style={{ marginRight: 8 }}
                    />
                    <Typography variant="body1" color="black">
                      Human Agent
                    </Typography>
                  </Button>
                </Popover>
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "#f5f5f5",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
          },
        }}
      />
      {((reduxIsVision?.vision && mode?.includes("human")) ||
        (reduxIsVision?.vision && !mode?.includes("human"))) && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="upload-image"
            multiple
          />
          <label htmlFor="upload-image">
            <Tooltip title="Upload Image" placement="top">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  bottom: theme.spacing(1),
                  left: theme.spacing(1),
                  backgroundColor: theme.palette.primary.main,
                  padding: theme.spacing(1),
                }}
                disableRipple
                disabled={isUploading || loading}
              >
                {isUploading ? (
                  <CircularProgress
                    size={24}
                    sx={{ color: theme.palette.primary.main }}
                  />
                ) : (
                  <UploadFileIcon sx={{ color: isLight ? "black" : "white" }} />
                )}
              </IconButton>
            </Tooltip>
          </label>
        </>
      )}
      <IconButton
        onClick={() =>
          !loading && !isUploading
            ? onSend({ Message: message, images: images })
            : null
        }
        sx={{
          position: "absolute",
          bottom: theme.spacing(1),
          right: theme.spacing(1),
          opacity: loading || isUploading ? 0.5 : 1,
          backgroundColor: theme.palette.primary.main,
          padding: theme.spacing(1),
        }}
        disableRipple
      >
        <SendIcon sx={{ color: isLight ? "black" : "white" }} />
      </IconButton>
    </Box>
  );
}

export default ChatbotTextField;
