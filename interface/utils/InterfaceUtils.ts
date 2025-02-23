export const ComponentJson: any = {
  Form: {
    type: "Form",
    key: "",
  },
  TextField: {
    type: "TextField",
    key: "",
    props: {
      label: "",
      variant: "outlined",
      size: "medium",
      defaultValue: "",
      placeholder: "write text here",
      type: "text",
    },
  },
  Button: {
    type: "Button",
    key: "",
    props: {
      variant: "outlined",
      color: "error",
      label: "button",
      type: "submit",
    },
  },
  Checkbox: {
    type: "Checkbox",
    key: "",
    props: {
      color: "primary",
      defaultChecked: false,
      label: "Checkbox",
    },
  },
  Radio: {
    type: "Radio",
    key: "",
    props: {
      color: "primary",
      name: "Radio",
      defaultValue: "Hello",
      options: ["Hello", "Okk", "Bye"],
    },
  },
  Select: {
    type: "Select",
    key: "",
    props: {
      label: "Select an option",
      variant: "outlined",
      options: ["Option 1", "Option 2", "Option 3"],
    },
  },
  DatePicker: {
    type: "DatePicker",
    key: "",
    props: {
      label: "Select a date",
      variant: "inline",
      value: "2023-01-15",
    },
  },
  Typography: {
    type: "Typography",
    key: "typography1",
    props: {
      variant: "bold",
      children: `I'm a text component.`,
      textAlign: "left",
    },
  },
  ChatBot: {
    type: "ChatBot",
    key: "ChatBot",
    props: {
      variant: "outlined",
      value: "2023-01-15",
    },
  },
  Icon: {
    type: "Icon",
    key: "Icon",
    props: {
      variant: "square",
      src: "https://cdn2.hubspot.net/hubfs/53/image8-2.jpg",
    },
  },
  Accordion: {
    type: "Accordion",
    key: "",
    props: {
      variant: "outlined",
    },
  },
  Box: {
    type: "Box",
    key: "",
  },
  Divider: {
    type: "Divider",
    key: "",
    props: {
      orientation: "horizontal",
    },
  },
  Table: {
    type: "Table",
    key: "",
    props: {
      // Common props
      columns: [],
      data: [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Alice", age: 25 },
        { id: 3, name: "Bob", age: 55 },
        { id: 4, name: "Bosb", age: 45 },
      ],
    },
  },
};

export function set(obj: any, path: string, value: any) {
  if (!path) return value;
  if (Object(obj) !== obj) return obj; // If the object is not an object, return it.
  if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []; // Convert path to array if not already.

  path.slice(0, -1).reduce((a, c, i) => {
    // Iterate through the path, except for the last part.
    return Object(a[c]) === a[c] // Check if the key exists and is an object.
      ? a[c] // If yes, return the object for the next iteration.
      : (a[c] =
          Math.abs(path[i + 1]) >> 0 === +path[i + 1] // Check if the next key is an array index.
            ? [] // If yes, create a new array.
            : {}); // Otherwise, create a new object.
  }, obj)[path[path.length - 1]] = value; // Set the value at the final part of the path.

  return obj; // Return the updated object.
}

export function get(obj: any, path: string, defaultValue: any = undefined) {
  if (!path) {
    return defaultValue;
  }

  const keys = path?.split(".");
  let result = obj;

  /* eslint-disable-next-line no-restricted-syntax */
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }

  return result !== undefined ? result : defaultValue;
}

export function unset(obj: any, path: string) {
  if (typeof obj !== "object" || obj === null || typeof path !== "string") {
    return false;
  }

  let current = obj;
  const pathParts = path?.split(".");
  const lastIndex = pathParts.length - 1;

  for (let i = 0; i < lastIndex; ++i) {
    if (current[pathParts[i]] === undefined) {
      // Early return if the path is not found
      return false;
    }
    current = current[pathParts[i]];
  }

  if (lastIndex > 0 && current[pathParts[lastIndex]] !== undefined) {
    delete current[pathParts[lastIndex]];
    return true;
  }
  if (lastIndex === 0 && obj[pathParts[0]] !== undefined) {
    // Handle single-level paths
    delete obj[pathParts[0]];
    return true;
  }

  return false;
}

export function shallowEqual(obj1: any, obj2: any) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of properties is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if the values of corresponding properties are equal
  /* eslint-disable-next-line no-restricted-syntax */
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export const gridXY = {
  rowHeight: 4,
  cols: 12,
};

export const DataforComponents: any = {
  Button: {
    initialDimensions: {
      h: 20 / gridXY.rowHeight,
      w: gridXY.cols / 10,
    },
    variants: ["contained", "outlined", "text"],
    props: ["key", "id", "label", "color", "disabled", "href", "variant"],
    actions: [
      { type: "flow", title: "Connect to flow" },
      { type: "navigate", title: "Navigate to page" },
      { type: "alert", title: "Alert" },
      { type: "sendDataToFrontend", title: "Send Data To Frontend" },
    ],
  },
  TextField: {
    initialDimensions: {
      h: 24 / gridXY.rowHeight,
      w: gridXY.cols / 6,
    },
    variants: ["filled", "standard", "outlined"],
    props: [
      "key",
      "label",
      "required",
      "type",
      "variant",
      "disabled",
      "multiline",
      "rows",
      "minRows",
      "maxRows",
      "multiple",
      "value",
      "defaultValue",
      "placeholder",
    ],
    type: [
      "text",
      "password",
      "number",
      "email",
      "tel",
      "url",
      "search",
      "date",
      "time",
      "datetime-local",
      "month",
      "week",
    ],
  },
  ChatBot: {
    initialDimensions: {
      h: 150 / gridXY.rowHeight,
      w: gridXY.cols / 2,
    },
    variants: [],
    props: ["key"],
    // actions: [
    //   {
    //     type: 'chatbot',
    //     title: 'Enter your Prompt'
    //   }
    // ]
  },
  Form: {
    initialDimensions: {
      h: 120 / gridXY.rowHeight,
      w: gridXY.cols / 3,
    },
    variants: [],
    props: ["key"],
  },
  DatePicker: {
    initialDimensions: {
      h: 20 / gridXY.rowHeight,
      w: gridXY.cols / 10,
    },
    variants: [],
    props: ["key"],
  },
  Checkbox: {
    initialDimensions: {
      h: 20 / gridXY.rowHeight,
      w: gridXY.cols / 6,
    },
    variants: [],
    props: [
      "key",
      "id",
      "label",
      "color",
      "disabled",
      "checked",
      "defaultChecked",
    ],
  },
  Radio: {
    initialDimensions: {
      h: 50 / gridXY.rowHeight,
      w: gridXY.cols / 6,
    },
    variants: [],
    props: [
      "key",
      "options",
      "required",
      "name",
      "color",
      "disabled",
      "value",
      "defaultValue",
    ],
  },
  Select: {
    initialDimensions: {
      h: 20 / gridXY.rowHeight,
      w: gridXY.cols / 6,
    },
    variants: ["filled", "standard", "outlined"],
    props: [
      "key",
      "options",
      "label",
      "disabled",
      "value",
      "defaultValue",
      "variant",
    ],
  },
  Typography: {
    initialDimensions: {
      h: 30 / gridXY.rowHeight,
      w: gridXY.cols / 6,
    },
    variants: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "base",
      "smallHeading",
      "bold",
    ],
    textAlignments: ["left", "center", "right", "start", "end", "justify"],
    props: ["key", "id", "color", "children", "variant", "textAlign"],
  },
  Icon: {
    initialDimensions: {
      h: 30 / gridXY.rowHeight,
      w: gridXY.cols / 4,
    },
    props: ["key", "src", "variant"],
    variants: ["square", "circlular", "rounded"],
  },
  Accordion: {
    initialDimensions: {
      h: 30 / gridXY.rowHeight,
      w: gridXY.cols / 4,
    },
    props: ["key", "title", "description", "variant"],
    variants: ["outlined", "elevation"],
  },
  Box: {
    initialDimensions: {
      h: 120 / gridXY.rowHeight,
      w: gridXY.cols / 3,
    },
    variants: [],
    props: ["key"],
  },
  Divider: {
    initialDimensions: {
      h: 24 / gridXY.rowHeight,
      w: gridXY.cols / 5,
    },
    props: ["key", "type"],
    type: ["horizontal", "vertical"],
  },
  Table: {
    initialDimensions: {
      h: 90 / gridXY.rowHeight,
      w: gridXY.cols / 2,
    },
    variants: ["standard", "outlined", "bordered", "simple"],
    props: ["key", "id", "data", "pagination", "columns", "checkbox"],
  },
};

export const allowedProps: any = {
  key: "string",
  variant: "string",
  color: "string",
  onClick: "function",
  disabled: "boolean",
  href: "string",
  onChange: "function",
  value: "string",
  defaultValue: "string",
  label: "string",
  multiline: "boolean",
  maxRows: "number",
  rows: "number",
  minRows: "number",
  id: "string",
  placeholder: "string",
  autoFocus: "boolean",
  required: "boolean",
  type: "string",
  children: "string",
  options: "array",
  checked: "boolean",
  defaultChecked: "boolean",
  chatbot: "chatbot",
  src: "string",
  title: "string",
  description: "sring",
  orientation: "string",
  textAlign: "string",
  data: "array",
  customStyles: "string",
  pagination: "boolean",
  checkbox: "boolean",
};

export function formInitialChildren(type: string) {
  const uniqueTime = ((Date.now() / 1000) * 1000)?.toString();
  const textfield1Id = `TextField${(Math.random() + uniqueTime)
    .toString(36)
    .slice(2, 7)}`;
  const textfield2Id = `TextField${(Math.random() + uniqueTime)
    .toString(36)
    .slice(2, 7)}`;
  const ButtonId = `Button${(Math.random() + uniqueTime)
    .toString(36)
    .slice(2, 7)}`;
  if (type === "Form") {
    return {
      components: {
        [textfield1Id]: {
          type: "TextField",
          key: textfield1Id,
          props: {
            label: "",
            variant: "outlined",
            size: "medium",
            defaultValue: "",
            placeholder: "Enter username",
          },
        },
        [textfield2Id]: {
          type: "TextField",
          key: textfield2Id,
          props: {
            label: "",
            variant: "outlined",
            size: "medium",
            defaultValue: "",
            type: "password",
            placeholder: "Enter password",
          },
        },
        [ButtonId]: {
          type: "Button",
          key: ButtonId,
          props: {
            variant: "contained",
            color: "success",
            label: "submit",
            type: "submit",
          },
        },
      },
      coordinates: {
        [textfield1Id]: {
          h: 30 / gridXY.rowHeight,
          w: gridXY.cols,
          x: 0,
          y: 0,
          i: textfield1Id,
          moved: false,
          static: false,
          isDraggable: true,
        },
        [textfield2Id]: {
          h: 30 / gridXY.rowHeight,
          w: gridXY.cols,
          x: 0,
          y: 1,
          i: textfield2Id,
          moved: false,
          static: false,
          isDraggable: true,
        },
        [ButtonId]: {
          h: 20 / gridXY.rowHeight,
          w: gridXY.cols,
          x: 0,
          y: 1,
          i: ButtonId,
          moved: false,
          static: false,
          isDraggable: true,
        },
      },
    };
  }
  if (type === "ChatBot") {
    return {
      components: {
        [textfield1Id]: {
          type: "TextField",
          key: textfield1Id,
          props: {
            label: "",
            variant: "outlined",
            size: "medium",
            defaultValue: "",
            placeholder: "Enter username",
          },
        },
      },
      coordinates: {
        [textfield1Id]: {
          h: 30 / gridXY.rowHeight,
          w: gridXY.cols,
          x: 0,
          y: 0,
          i: textfield1Id,
          moved: false,
          static: false,
          isDraggable: true,
        },
      },
    };
  }
  return { components: {}, coordinates: {} };
}
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
export const intefaceSetLocalStorage = (key: string, value: string) => {
  // if (process.env.NEXT_PUBLIC_API_ENVIRONMENT === "local") {
  //   window.interfaceData = JSON.stringify({
  //     ...JSON.parse(window?.interfaceData || "{}"),
  //     [key]: value,
  //   });
  //   return;
  // }
  localStorage.setItem(key, value);
};
export const intefaceGetLocalStorage = (key: string) => {
  // if (process.env.NEXT_PUBLIC_API_ENVIRONMENT === "local") {
  //   return JSON.parse(window?.interfaceData || "{}")?.[key];
  // }
  return localStorage.getItem(key);
};

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
