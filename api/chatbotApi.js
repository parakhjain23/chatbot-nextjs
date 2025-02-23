"use client";
import axios from "../interceptor/interceptor";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const sendMessage = async (scriptId, functionId, data) => {
  try {
    return await axios.post(
      `${URL}/chatbot/message/${scriptId}/functions/${functionId}`,
      data
    );
  } catch (e) {
    return e;
  }
};
export const allChats = async (scriptId, functionId) => {
  try {
    const data = await axios.get(
      `${URL}/chatbot/${scriptId}/functions/${functionId}`
    );
    return data;
  } catch (e) {
    return e;
  }
};

export const getAccessToken = async () => {
  try {
    const response = await axios.post(`${URL}/utility/get-token`);
    return response?.data?.data;
  } catch (e) {
    return e;
  }
};
