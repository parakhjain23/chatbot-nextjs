'use client';

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ChevronUp, Send, Upload, X } from "lucide-react";
import { Popover, useTheme } from "@mui/material";
import { AiIcon, UserAssistant } from "@/assests/assestsIndex";
import { errorToast } from "@/components/customToast";
import { setHuman } from "@/store/hello/helloSlice";
import { $ReduxCoreType } from "@/types/reduxCore";
import { useCustomSelector } from "@/utils/deepCheckSelector";
import { isColorLight } from "@/utils/themeUtility";
import { uploadImage } from "@/config/api";
import { MessageContext } from "./InterfaceChatbot";
import Image from "next/image";

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
    <div className="relative w-full bg-base-200 rounded-lg shadow-sm">
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
        <div className="flex flex-wrap gap-2 my-4 px-4">
          {images.map((image, index) => (
            <div key={index} className="relative max-w-[20%] md:max-w-[15%] h-8 rounded-lg bg-base-200 flex items-center justify-center p-0.5">
              <Image
                src={image as string}
                alt={`Uploaded Preview ${index + 1}`}
                className="max-w-full max-h-full rounded-lg object-cover"
                width={48}
                height={48}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="btn btn-circle btn-xs absolute -top-1 -right-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end">
        <div className="absolute left-3 top-4 z-10">
          <div
            className="relative w-7 h-7 cursor-pointer"
            onClick={isHelloAssistantEnabled ? () => handlePopoverOpen : undefined}
          >
            <Image
              src={IsHuman ? UserAssistant : AiIcon}
              width={28}
              height={28}
              alt="AI"
              className={`absolute transition-opacity duration-200 ${!IsHuman ? 'filter drop-shadow-pink' : ''}`}
            />
            {isHelloAssistantEnabled && (
              <ChevronUp className="absolute w-7 h-7 opacity-0 hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        <div className="relative w-full">
          <textarea
            ref={messageRef}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant..."
            disabled={disabled}
            className="textarea w-full pl-12 pr-12 min-h-[120px] max-h-[300px] md:min-h-[100px] resize-none focus:outline-none disabled:bg-base-200 disabled:cursor-not-allowed rounded-xl border border-gray-300 shadow-inner bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 py-4"
            rows={3}
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
                <label htmlFor="upload-image" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 bg-white/90 shadow-sm backdrop-blur-md hover:bg-gray-100 transition-all duration-200 group">
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <span className="loading loading-spinner loading-xs text-primary" />
                        <span className="text-xs font-medium text-gray-600">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Upload className={`w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200`} />
                        <span className="text-xs font-medium text-gray-700">Upload Image</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            )}

          <button
            onClick={() => !loading && !isUploading ? onSend({ Message: message, images: images }) : null}
            className={`btn btn-circle md:btn-sm absolute right-3 bottom-3 ${loading || isUploading ? 'btn-disabled' : ''} hover:scale-105 transition-transform duration-200`}
            disabled={loading || isUploading}
            style={{
              backgroundColor: loading || isUploading ? undefined : theme.palette.primary.main
            }}
          >
            <Send className={`w-5 h-5 md:w-4 md:h-4 ${isLight ? 'text-black' : 'text-white'}`} />
          </button>
        </div>
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
        <div className="flex flex-col p-2 min-w-[200px] md:min-w-[180px] rounded-lg shadow-lg">
          <button
            onClick={() => {
              EnableAI();
              handlePopoverClose();
            }}
            className="btn btn-ghost justify-start normal-case md:btn-sm hover:bg-gray-100"
          >
            <Image
              src={AiIcon}
              width={30}
              height={30}
              alt="AI Icon"
              className="mr-3 filter drop-shadow-pink md:w-6 md:h-6"
            />
            <span>AI</span>
          </button>

          <button
            onClick={() => {
              EnableHumanAgent();
              handlePopoverClose();
            }}
            className="btn btn-ghost justify-start normal-case md:btn-sm hover:bg-gray-100"
          >
            <Image
              src={UserAssistant}
              width={30}
              height={30}
              alt="Human Agent"
              className="mr-3 md:w-6 md:h-6"
            />
            <span>Human Agent</span>
          </button>
        </div>
      </Popover>
    </div>
  );
}

export default ChatbotTextField;
