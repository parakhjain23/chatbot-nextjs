"use client";
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
  useTheme,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
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

const createRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

interface ChatbotDrawerProps {
  setLoading: (loading: boolean) => void;
  open: boolean;
  toggleDrawer: (open: boolean) => () => void;
  interfaceId: string;
}

function ChatbotDrawer({ setLoading, open, toggleDrawer, interfaceId }: ChatbotDrawerProps) {
  const theme = useTheme();
  const isLightBackground = theme?.palette?.primary?.main ? isColorLight(theme.palette.primary.main) : false;
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
    <Paper elevation={0} sx={{ width: 280, bgcolor: 'transparent' }}>
      {(subThreadList || []).length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" minHeight={200}>
          <Typography variant="subtitle1" color="text.secondary">
            No Threads Available
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {subThreadList.map((thread: any, index: number) => (
            <ListItem
              key={thread?._id || index}
              disablePadding
              sx={{ mb: 0.5 }}
            >
              <ListItemButton
                selected={thread?.sub_thread_id === selectedSubThreadId}
                onClick={() => handleChangeSubThread(thread?.sub_thread_id)}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Tooltip title={thread?.display_name || thread?.sub_thread_id} placement="top">
                      <Typography variant="body2" noWrap>
                        {thread?.display_name || thread?.sub_thread_id}
                      </Typography>
                    </Tooltip>
                  }
                  sx={{ color: 'inherit' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );

  return (
    <Drawer
      open={open}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: theme?.palette?.primary?.main ? lighten(theme.palette.primary.main, 0.2) : '#fff',
        }
      }}
    >
      <Stack height="100%">
        <Box px={2} py={1.5} display="flex" alignItems="center" justifyContent="space-between">
          <IconButton onClick={toggleDrawer(false)} size="small">
            <CloseSidebarIcon color={textColor} />
          </IconButton>
          <Typography variant="h6" fontWeight="medium" color={textColor}>
            Chat History
          </Typography>
          <IconButton
            onClick={handleCreateNewSubThread}
            size="small"
            sx={{ color: textColor }}
          >
            <CreateIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'divider' }} />
        <Box flex={1} overflow="auto" p={2}>
          {DrawerList}
        </Box>
      </Stack>
    </Drawer>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(ChatbotDrawer), [ParamsEnums.interfaceId])
);
