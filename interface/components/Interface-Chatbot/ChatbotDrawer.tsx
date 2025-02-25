"use client";
import CreateIcon from "@mui/icons-material/Create";
import { useTheme } from "@mui/material";
import { lighten } from "@mui/system";
import React from "react";
import { useDispatch } from "react-redux";
import { createNewThreadApi } from "../../../api/InterfaceApis/InterfaceApis";
import CloseSidebarIcon from "../../../public/CloseSidebar";
import { ParamsEnums } from "../../../enums";
import addUrlDataHoc from "../../../hoc/addUrlDataHoc";
import {
  setThreadId,
  setThreads,
} from "../../../store/interface/interfaceSlice";
import { $ReduxCoreType } from "../../../types/reduxCore";
import { useCustomSelector } from "../../../utils/deepCheckSelector";
import isColorLight from "../../../utils/themeUtility";
import { GetSessionStorageData } from "../../utils/InterfaceUtils";
import { PanelRightOpen, SquarePen } from "lucide-react";

const createRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

interface ChatbotDrawerProps {
  setLoading: (loading: boolean) => void;
  open: boolean;
  toggleDrawer: (open: boolean) => () => void;
  interfaceId: string;
}

function ChatbotDrawer({
  setLoading,
  open,
  toggleDrawer,
  interfaceId,
}: ChatbotDrawerProps) {
  const theme = useTheme();
  const isLightBackground = theme?.palette?.primary?.main
    ? isColorLight(theme.palette.primary.main)
    : false;
  const textColor = isLightBackground ? "black" : "white";
  const dispatch = useDispatch();
  const { reduxThreadId, subThreadList, reduxSubThreadId, reduxBridgeName } =
    useCustomSelector((state: $ReduxCoreType) => ({
      reduxThreadId: state.Interface?.threadId || "",
      reduxSubThreadId: state.Interface?.subThreadId || "",
      reduxBridgeName:
        GetSessionStorageData("bridgeName") ||
        state.Interface?.bridgeName ||
        "root",
      subThreadList:
        state.Interface?.interfaceContext?.[interfaceId]?.[
          GetSessionStorageData("bridgeName") ||
            state.Interface?.bridgeName ||
            "root"
        ]?.threadList?.[
          GetSessionStorageData("threadId") || state.Interface?.threadId
        ] || [],
    }));

  const thread_id = GetSessionStorageData("threadId") || reduxThreadId;
  const selectedSubThreadId = reduxSubThreadId;

  const handleCreateNewSubThread = async () => {
    const result = await createNewThreadApi({
      threadId: thread_id,
      subThreadId: createRandomId(),
    });
    if (result?.success) {
      dispatch(
        setThreads({
          newThreadData: result.thread,
          bridgeName: GetSessionStorageData("bridgeName") || reduxBridgeName,
          threadId: thread_id,
        }) as any
      );
      toggleDrawer(false)();
    }
  };

  const handleChangeSubThread = (sub_thread_id: string) => {
    setLoading(false);
    dispatch(setThreadId({ subThreadId: sub_thread_id }) as any);
  };

  const DrawerList = (
    <div className="bg-transparent">
      {(subThreadList || []).length === 0 ? (
        <div className="flex justify-center items-center h-full min-h-[200px] p-5">
          <p className=" text-lg" style={{ color: textColor }}>
            No Threads Available
          </p>
        </div>
      ) : (
        <ul className="p-0">
          {subThreadList.map((thread: any, index: number) => (
            <li key={thread?._id || index} className="mb-1">
              <button
                className="w-full rounded-md p-2 text-left transition-colors"
                style={{
                  ...(thread?.sub_thread_id === selectedSubThreadId
                    ? {
                        backgroundColor: lighten(
                          theme.palette.primary.main,
                          0.8
                        ),
                        color: "black",
                      }
                    : {
                        backgroundColor: "transparent",
                        color: textColor,
                      }),
                }}
                onClick={() => handleChangeSubThread(thread?.sub_thread_id)}
              >
                <span
                  className="truncate block"
                  title={thread?.display_name || thread?.sub_thread_id}
                >
                  {thread?.display_name || thread?.sub_thread_id}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div
      className={`fixed top-0 left-0 w-[280px] h-full shadow-lg transform transition-transform z-50 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ background: theme.palette.primary.main }}
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-2 flex items-center justify-between">
          <button onClick={toggleDrawer(false)} className="p-1">
            <PanelRightOpen color={textColor} />
          </button>
          <p className="text-lg font-bold" style={{ color: textColor }}>
            Chat History
          </p>
          <button
            onClick={handleCreateNewSubThread}
            className="p-1"
            style={{ color: textColor }}
          >
            <SquarePen className="text-sm" />
          </button>
        </div>
        <hr className="border-t border-gray-300" />
        <div className="flex-1 p-1">{DrawerList}</div>
      </div>
    </div>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(ChatbotDrawer), [ParamsEnums.interfaceId])
);
