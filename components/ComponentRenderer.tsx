/* eslint-disable */
import React, { useContext } from "react";
import { ParamsEnums } from "@/utils/enums";
import { addUrlDataHoc } from "@/hoc/addUrlDataHoc";
import { GridContext } from "@/components/Grid/Grid";
import InterfaceAccordion from "@/components/Interface-Accordion/InterfaceAccordion";
import InterfaceBox from "@/components/Interface-Box/InterfaceBox";
import InterfaceButton from "@/components/Interface-Button/InterfaceButton";
import InterfaceMarkdown from "@/components/Interface-Chatbot/Interface-Markdown/InterfaceMarkdown";
import InterfaceTextfield from "./Interface-TextField/InterfaceTextfield";
import InterfaceDropdown from "./Interface-DropDown/InterfaceDropdown";
import InterfaceDivider from "./Interface-Divider/InterfaceDivider";
import InterfaceText from "./Interface-Text/InterfaceText";
import InterfaceLink from "./Interface-Link/InterfaceLink";
import InterfaceCheckbox from "./Interface-Checkbox/InterfaceCheckbox";
import InterfaceForm from "./Interface-Form/InterfaceForm";
import InterfaceChatbot from "./Interface-Chatbot/InterfaceChatbot";
import Interfacedatepicker from "./InterfaceDatepicker/Interfacedatepicker";
import InterfaceRadio from "./InterfaceRadio/InterfaceRadio";
import InterfaceIcon from "./Interface-Icon/InterfaceIcon";
import InterfaceTable from "./Interface-Table/InterfaceTable";
import InterfaceCard from "./Interface-Card/InterfaceCard";


interface ComponentRendererProps {
  gridId?: string;
  componentId: string;
  dragRef?: any;
  inpreview?: boolean;
  chatbotId: string;
}
ComponentRenderer.defaultProps = {
  id: "",
  gridId: "root",
  dragRef: {},
  inpreview: false,
};

const componentMap: any = {
  Input: (data: any) => <InterfaceTextfield {...data} />,
  TextField: (data: any) => <InterfaceTextfield {...data} />,
  TextArea: (data: any) => <InterfaceTextfield {...data} />,
  Button: (data: any) => <InterfaceButton {...data} />,
  Select: (data: any) => <InterfaceDropdown {...data} />,
  Divider: (data: any) => <InterfaceDivider {...data} />,
  Text: (data: any) => <InterfaceText {...data} />,
  Link: (data: any) => <InterfaceLink {...data} />,
  Box: (data: any) => <InterfaceBox {...data} ingrid />,
  Checkbox: (data: any) => <InterfaceCheckbox {...data} />,
  Form: (data: any) => <InterfaceForm {...data} ingrid />,
  ChatBot: (data: any) => <InterfaceChatbot {...data} />,
  Typography: (data: any) => <InterfaceText {...data} />,
  DatePicker: (data: any) => <Interfacedatepicker {...data} />,
  Radio: (data: any) => <InterfaceRadio {...data} />,
  Icon: (data: any) => <InterfaceIcon {...data} />,
  Accordion: (data: any) => <InterfaceAccordion {...data} />,
  Table: (data: any) => <InterfaceTable {...data} />,
  Markdown: (data: any) => <InterfaceMarkdown {...data} />,
  Card: (data: any) => <InterfaceCard {...data} />,
};

function ComponentRenderer({
  // gridId,
  componentId,
  dragRef,
  inpreview = false,
}: ComponentRendererProps) {
  const responseTypeJson: any = useContext(GridContext);
  // const { type, props, key, action } = componentData;
  const type =
    responseTypeJson?.components?.[componentId]?.type ||
    responseTypeJson?.[componentId]?.type;
  const props =
    responseTypeJson?.components?.[componentId]?.props ||
    responseTypeJson?.[componentId]?.props;
  const action =
    responseTypeJson?.components?.[componentId]?.action ||
    responseTypeJson?.[componentId]?.action;

  const component = componentMap[type] || null;

  if ((component && type === "Button") || type === "ChatBot") {
    return component({
      props,
      componentId,
      inpreview,
      action,
    });
  }

  return component
    ? component({
      props,
      componentId,
      inpreview,
      dragRef,
      action,
    })
    : null;
}

export default React.memo(
  addUrlDataHoc(React.memo(ComponentRenderer), [ParamsEnums?.chatbotId])
);
