'use client';

// React and Redux
import React from "react";
import { useDispatch } from "react-redux";

// MUI Components and Icons
import CreateIcon from "@mui/icons-material/Create";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { lighten, useTheme } from "@mui/system";

// App imports
import CloseSidebarIcon from "@/assests/CloseSidebar";
import { createNewThreadApi } from "@/config/api";
import { addUrlDataHoc } from "@/hoc/addUrlDataHoc";
import {
  setThreadId,
  setThreads,
} from "@/store/interface/interfaceSlice";
import { $ReduxCoreType } from "@/types/reduxCore";
import { GetSessionStorageData, toggleSidebar } from "@/utils/ChatbotUtility";
import { useCustomSelector } from "@/utils/deepCheckSelector";
import { ParamsEnums } from "@/utils/enums";
import { isColorLight } from "@/utils/themeUtility";
import { AlignJustify } from "lucide-react";

// function to create random id for new thread
const createRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

function ChatbotDrawer({ setLoading, open, toggleDrawer, chatbotId }) {
  const theme = useTheme();
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";
  const dispatch = useDispatch();
  const { reduxThreadId, subThreadList, reduxSubThreadId, reduxBridgeName } =
    useCustomSelector((state: $ReduxCoreType) => ({
      reduxThreadId: state.Interface?.threadId || "",
      reduxSubThreadId: state.Interface?.subThreadId || "", // Get subThreadId from Redux
      reduxBridgeName:
        GetSessionStorageData("bridgeName") ||
        state.Interface?.bridgeName ||
        "root", // Get bridgeName
      subThreadList:
        state.Interface?.interfaceContext?.[chatbotId]?.[
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
          newThreadData: result?.thread,
          bridgeName: GetSessionStorageData("bridgeName") || reduxBridgeName,
          threadId: thread_id,
        })
      );
      toggleDrawer(false)();
    }
  };

  const handleChangeSubThread = (sub_thread_id: string) => {
    setLoading(false);
    dispatch(setThreadId({ subThreadId: sub_thread_id }));
  };

  const DrawerList = (
    <div className="w-[280px]" role="presentation" onClick={toggleDrawer(false)}>
      {(subThreadList || []).length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="mt-5 text-base font-medium" style={{ color: textColor || 'black' }}>
            No Threads
          </p>
        </div>
      ) : (
        <ul className="menu menu-compact">
          {subThreadList.map((thread) => (
            <li key={thread?._id} onClick={() => handleChangeSubThread(thread?.sub_thread_id)}>
              <a
                className={`${thread?.sub_thread_id === selectedSubThreadId ? 'active' : ''
                  }`}
              >
                {(thread?.display_name || thread?.sub_thread_id)?.length > 30 ? (
                  <div className="tooltip" data-tip={thread?.display_name || thread?.sub_thread_id}>
                    <span style={{ color: textColor || 'black' }}>
                      {`${(thread?.display_name || thread?.sub_thread_id)?.substring(0, 27)}...`}
                    </span>
                  </div>
                ) : (
                  <span style={{ color: textColor || 'black' }}>
                    {thread?.display_name || thread?.sub_thread_id}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  const toggleMainSidebar = () => toggleSidebar("main-sidebar");
  return (
    // <Drawer open={open} onClose={toggleDrawer(false)}>
    //   <Box
    //     sx={{
    //       backgroundColor: lighten(theme.palette.primary.main, 0.2),
    //       flex: 1,
    //     }}
    //   >
    //     <Box className="flex-spaceBetween-center p-3 gap-2">
    //       <Box onClick={toggleDrawer(false)} className="mr-2 cursor-pointer">
    //         <CloseSidebarIcon color={textColor} />
    //       </Box>
    //       <Typography
    //         variant="body1"
    //         className="font-bold"
    //         sx={{ color: textColor }}
    //       >
    //         History
    //       </Typography>
    //       <CreateIcon
    //         className="cursor-pointer"
    //         onClick={handleCreateNewSubThread}
    //         color="inherit"
    //         style={{ color: textColor || "black" }}
    //       />
    //     </Box>
    //     <Divider sx={{ borderColor: textColor || "black" }} />
    //     {DrawerList}
    //   </Box>
    // </Drawer>
    <div className="relative" style={{ backgroundColor: lighten(theme.palette.primary.main, 0.2) }}>
      <label htmlFor="my-drawer-2" className="drawer-button lg:hidden z-10 absolute top-3 left-1">
        <AlignJustify size={24} onClick={toggleMainSidebar} style={{ color: textColor || "black" }} />
      </label>
      <div className={`drawer lg:drawer-open relative z-[101] lg:z-0`}>
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
        </div>
        <div className="drawer-side h-screen">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200" style={{ backgroundColor: lighten(theme.palette.primary.main, 0.2) }}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-bold" style={{ color: textColor }}>History</h1>
              <CreateIcon
                className="cursor-pointer"
                onClick={handleCreateNewSubThread}
                style={{ color: textColor || "black" }}
              />
            </div>
            {DrawerList}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(ChatbotDrawer), [ParamsEnums.chatbotId])
);
