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
import { GetSessionStorageData } from "@/utils/ChatbotUtility";
import { useCustomSelector } from "@/utils/deepCheckSelector";
import { ParamsEnums } from "@/utils/enums";
import { isColorLight } from "@/utils/themeUtility";

// function to create random id for new thread
const createRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

function ChatbotDrawer({ setLoading, open, toggleDrawer, interfaceId }) {
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
    <Box sx={{ width: 280 }} role="presentation" onClick={toggleDrawer(false)}>
      {(subThreadList || []).length === 0 ? (
        <Box className="flex-center-center">
          <Typography
            variant="subtitle1"
            className="mt-5"
            color={textColor || "black"}
          >
            No Threads
          </Typography>
        </Box>
      ) : (
        <List>
          {subThreadList.map((thread) => (
            <ListItem
              key={thread?._id}
              disablePadding
              dense
              onClick={() => handleChangeSubThread(thread?.sub_thread_id)}
            >
              <ListItemButton
                selected={thread?.sub_thread_id === selectedSubThreadId}
                sx={{
                  backgroundColor:
                    thread?.sub_thread_id === selectedSubThreadId
                      ? "primary.main"
                      : "transparent",
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                  },
                }}
              >
                <ListItemText
                  primary={
                    (thread?.display_name || thread?.sub_thread_id)?.length >
                    30 ? (
                      <Tooltip
                        title={thread?.display_name || thread?.sub_thread_id}
                        placement="top"
                      >
                        <span>{`${(
                          thread?.display_name || thread?.sub_thread_id
                        )?.substring(0, 27)}...`}</span>
                      </Tooltip>
                    ) : (
                      thread?.display_name || thread?.sub_thread_id
                    )
                  }
                  color="inherit"
                  sx={{ color: textColor || "black" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          backgroundColor: lighten(theme.palette.primary.main, 0.2),
          flex: 1,
        }}
      >
        <Box className="flex-spaceBetween-center p-3 gap-2">
          <Box onClick={toggleDrawer(false)} className="mr-2 cursor-pointer">
            <CloseSidebarIcon color={textColor} />
          </Box>
          <Typography
            variant="body1"
            className="font-bold"
            sx={{ color: textColor }}
          >
            History
          </Typography>
          <CreateIcon
            className="cursor-pointer"
            onClick={handleCreateNewSubThread}
            color="inherit"
            style={{ color: textColor || "black" }}
          />
        </Box>
        <Divider sx={{ borderColor: textColor || "black" }} />
        {DrawerList}
      </Box>
    </Drawer>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(ChatbotDrawer), [ParamsEnums.interfaceId])
);
