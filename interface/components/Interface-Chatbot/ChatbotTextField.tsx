"use client";
/* eslint-disable */
import { FileUp, SendHorizontal, X } from "lucide-react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  lighten,
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
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";
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

  // const options = ["dddddddddddddddddddddddddddddddddd"];
  return (
    <div
      className={`w-full rounded-lg flex flex-col justify-center items-center min-h-fit`}
    >
      <div className="max-w-[900px] w-full flex items-start">
        {options && options.length > 0 && (
          <div className="flex flex-col items-start gap-3 pb-4 animate-[fadeIn_0.3s_ease-in-out_forwards] ">
            {options.slice(0, 3).map((option, index) => (
              <div
                key={index}
                onClick={() => addMessage(option)}
                className={`flex items-center justify-center min-h-[32px] rounded-lg shadow-lg   text-center px-4 py-2 transition-all cursor-pointer`}
                style={{ background: lighten(theme.palette.primary.main, 0.8) }}
              >
                <span className="text-lg">{option}</span>
              </div>
            ))}
          </div>
        )}
        {images.length > 0 && (
          <div className="flex mt-4 mb-2 flex-wrap gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative max-w-[20%] max-h-[50px] rounded flex items-center justify-center p-1`}
              >
                <Image
                  src={image}
                  alt={`Uploaded Preview ${index + 1}`}
                  className="max-w-full max-h-full rounded"
                />
                <button
                  className={`absolute top-[-2px] right-[-2px] bg-opacity-80 rounded-full cursor-pointer w-5 h-5 flex items-center justify-center`}
                  onClick={() => handleRemoveImage(index)}
                >
                  <X color={theme.palette.primary.main} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="relative max-w-[900px] w-full rounded-lg">
        <div
          className="border-2 flex flex-col shadow-sm rounded-lg p-2"
          style={{
            border: `2px solid ${lighten(theme.palette.primary.main, 0.8)}`,
          }}
        >
          <div className="flex items-start ">
            <Image
              src={AiIcon}
              width="32"
              height="32"
              alt="AI"
              className="pt-1"
            />
            <textarea
              ref={messageRef}
              className={`w-full bg-transparent rounded-lg text-lg p-2 resize-none focus:outline-none`}
              rows={2}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your message..."
              disabled={disabled}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {(reduxIsVision?.vision && mode?.includes("human")) ||
            (reduxIsVision?.vision && !mode?.includes("human")) ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="upload-image"
                  multiple
                />
                <label htmlFor="upload-image" className="cursor-pointer">
                  <FileUp
                    color={theme.palette.primary.main}
                    className={`text-xl ${
                      isUploading || loading ? "opacity-50" : ""
                    }`}
                  />
                </label>
              </>
            ) : null}
            <button
              onClick={() =>
                !loading && !isUploading
                  ? onSend({ Message: message, images: images })
                  : null
              }
              className={`text-xl ${
                loading || isUploading ? "opacity-50" : ""
              }`}
              style={{ color: textColor }}
            >
              <SendHorizontal color={theme.palette.primary.main} size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotTextField;
