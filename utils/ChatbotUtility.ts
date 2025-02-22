export const SetSessionStorage = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
};

export const GetSessionStorageData = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error(
      `Error retrieving session storage data for key "${key}":`,
      error
    );
    return null;
  }
};

export const isJSONString = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const perFormAction = (actionData: any) => {
  const data = {
    message: actionData?.variables || actionData?.variable || {},
    type: "ChatbotResponse",
  };
  window?.parent?.postMessage(data, "*");

  // switch (actionData?.type?.toLowerCase()) {
  //   case "senddatatofrontend":
  //     /* eslint-disable-next-line */
  //     const data = {
  //       message: actionData.variable,
  //       type: "ChatbotResponse",
  //     };
  //     window?.parent?.postMessage(data, "*");
  //     break;
  //   case "senddatatoai":
  //     // data = {
  //     //   message: actionData.data,
  //     //   type: "ChatbotResponse",
  //     // };
  //     break;
  //   default:
  //     break;
  // }
};
