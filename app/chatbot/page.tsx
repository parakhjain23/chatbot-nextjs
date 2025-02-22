'use client';
import { SetSessionStorage } from "@/utils/ChatbotUtility";
import { EmbedVerificationStatus } from "@/utils/enums";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface InterfaceEmbedProps {
    onConfigChange: (config: string) => void;
}

export default function InterfaceEmbed({
    onConfigChange,
}: InterfaceEmbedProps) {
    const search = useSearchParams();
    const router = useRouter();
    const { chatbot_id, userId, token, config } = JSON.parse(
        new URLSearchParams(search).get("interfaceDetails") || "{}"
    );
    useEffect(() => {
        if (config) {
            onConfigChange(config); // update the chatbot configuration
        }
    }, [config]);

    const [verifiedState, setVerifiedState] = useState(
        EmbedVerificationStatus.VERIFYING
    );
    const [details, setDetails] = useState({ chatbot_id: "" });

    useEffect(() => {
        if (token) authorizeUserAndSetDetails();
    }, [token]);

    useEffect(() => {
        if (verifiedState === EmbedVerificationStatus.VERIFIED) {
            router.replace(`/chatbot/${details.chatbot_id}`);
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
        <div className="h-screen w-full flex items-center justify-center">
            {verifiedState === EmbedVerificationStatus.VERIFYING && (
                <span className="loading loading-ring loading-lg"></span>
            )}
            {verifiedState === EmbedVerificationStatus.NOT_VERIFIED && (
                <div>Something went wrong</div>
            )}
        </div>
    );
}
