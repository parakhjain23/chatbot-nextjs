/* eslint-disable */
'use client';

// React and Redux
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// MUI Components and Icons
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Popover,
  useTheme
} from "@mui/material";

// App imports
import { AiIcon, UserAssistant } from "@/assests/assestsIndex";
import { errorToast } from "@/components/customToast";
import { setHuman } from "@/store/hello/helloSlice";
import { $ReduxCoreType } from "@/types/reduxCore";
import { useCustomSelector } from "@/utils/deepCheckSelector";
import { isColorLight } from "@/utils/themeUtility";

// Local imports
import { uploadImage } from "@/config/api";
import { MessageContext } from "./InterfaceChatbot";

interface ChatbotTextFieldType {
  onSend?: any;
  loading?: boolean;
  messageRef?: any;
  disabled?: boolean;
  options?: any[];
  setChatsLoading?: any;
  images?: String[];
  setImages?: React.Dispatch<React.SetStateAction<string[]>>;
}
function ChatbotTextField({
  onSend = () => { },
  loading,
  messageRef,
  disabled = false,
  options = [],
  setChatsLoading = () => { },
  images = [],
  setImages = () => { },
}: ChatbotTextFieldType) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme(); // Hook to access the theme
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

  const handlePopoverOpen = (event) => {
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
            errorToast.warn("You have uploaded more than 4 images.");
          }
          const formData = new FormData();
          formData.append("image", file);
          const response = await uploadImage({ formData });
          if (response.success) {
            setImages((prev) => [...prev, response.image_url]);
          }
        }
        if (filesArray.length > 4) {
          errorToast.warn("You have uploaded more than 4 images.");
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
    <div className="relative w-full">
      {options && options.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 animate-fadeIn">
          {options?.slice(0, 3).map((option, index) => (
            <button
              key={index}
              onClick={() => addMessage(option)}
              className="px-4 py-2 text-sm rounded-lg shadow-sm bg-white hover:bg-gray-50 border border-gray-200 transition-colors duration-200"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {images.map((image, index) => (
            <div key={index} className="relative max-w-[20%] h-12 rounded-lg bg-gray-100 flex items-center justify-center p-0.5">
              <img
                src={image}
                alt={`Uploaded Preview ${index + 1}`}
                className="max-w-full max-h-full rounded-lg object-cover"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <span className="text-xs font-bold">✕</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end">
        <div className="absolute left-3 bottom-3 z-10">
          <div 
            className="relative w-7 h-7 cursor-pointer"
            onClick={isHelloAssistantEnabled ? handlePopoverOpen : null}
          >
            <img
              src={IsHuman ? UserAssistant : AiIcon}
              width="28"
              height="28" 
              alt="AI"
              className={`absolute transition-opacity duration-200 ${!IsHuman ? 'filter drop-shadow-pink' : ''}`}
            />
            {isHelloAssistantEnabled && (
              <ExpandLessIcon className="absolute w-7 h-7 opacity-0 hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        <input
          ref={messageRef}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your message"
          disabled={disabled}
          className="textarea textarea-bordered w-full pl-12 pr-12 min-h-[50px] max-h-[200px] resize-none focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          rows={1}
        />

        {((reduxIsVision?.vision && mode?.includes("human")) ||
          (reduxIsVision?.vision && !mode?.includes("human"))) && (
          <div className="absolute left-3 bottom-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="upload-image"
              multiple
            />
            <label htmlFor="upload-image">
              <button
                className={`p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors ${
                  isUploading || loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isUploading || loading}
              >
                {isUploading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadFileIcon className={`w-6 h-6 ${isLight ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            </label>
          </div>
        )}

        <button
          onClick={() => !loading && !isUploading ? onSend({ Message: message, images: images }) : null}
          className={`absolute right-3 bottom-3 p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors ${
            loading || isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading || isUploading}
        >
          <SendIcon className={`w-6 h-6 ${isLight ? 'text-black' : 'text-white'}`} />
        </button>
      </div>

      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className="mt-2"
      >
        <div className="flex flex-col p-2 min-w-[200px]">
          <button
            onClick={() => {
              EnableAI();
              handlePopoverClose();
            }}
            className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <img
              src={AiIcon}
              width="30"
              height="30"
              alt="AI Icon"
              className="mr-3 filter drop-shadow-pink"
            />
            <span className="text-gray-900">AI</span>
          </button>
          
          <button
            onClick={() => {
              EnableHumanAgent();
              handlePopoverClose();
            }}
            className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <img
              src={UserAssistant}
              width="30"
              height="30"
              alt="Human Agent"
              className="mr-3"
            />
            <span className="text-gray-900">Human Agent</span>
          </button>
        </div>
      </Popover>
    </div>
  );
}

export default ChatbotTextField;
