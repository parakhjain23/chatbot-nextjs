"use client";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import { EmbedVerificationStatus } from "../../../enums";
import InterfaceErrorPage from "../../components/InterfaceErrorPage/InterfaceErrorPage";
import { SetSessionStorage } from "../../utils/InterfaceUtils";
import { useRouter, useSearchParams } from "next/navigation";

interface InterfaceEmbedProps {
  onConfigChange: (string) => void;
}
export default function InterfaceEmbed({
  onConfigChange,
}: InterfaceEmbedProps) {
  const router = useRouter();
  const params = useSearchParams();
  // const navigate = useNavigate();
  const { chatbot_id, userId, token, config } = JSON.parse(
    params.get("interfaceDetails") || "{}"
  );
  // useEffect(() => {
  //   if (config) {
  //     onConfigChange(config); // update the chatbot configuration
  //   }
  // }, [config]);

  const [verifiedState, setVerifiedState] = useState(
    EmbedVerificationStatus.VERIFYING
  );
  const [details, setDetails] = useState({ chatbot_id: "" });
  console.log(details, "details");

  useEffect(() => {
    if (token) authorizeUserAndSetDetails();
  }, [token]);

  useEffect(() => {
    if (verifiedState === EmbedVerificationStatus.VERIFIED) {
      router.replace(`/i/${details.chatbot_id}`);
    }
  }, [verifiedState, details.chatbot_id]);

  const authorizeUserAndSetDetails = () => {
    // intefaceSetLocalStorage("interfaceToken", token);
    SetSessionStorage("interfaceToken", token);
    setVerifiedState(EmbedVerificationStatus.VERIFIED);
    setDetails({ chatbot_id });
    // localStorage.setItem("interfaceUserId", userId);
    SetSessionStorage("interfaceUserId", userId);
  };

  return (
    <Box className="flex-col-center-center w-100vw h-100vh">
      {verifiedState === EmbedVerificationStatus.VERIFYING && (
        <CircularProgress />
      )}
      {verifiedState === EmbedVerificationStatus.NOT_VERIFIED && (
        <InterfaceErrorPage />
      )}
    </Box>
  );
}
