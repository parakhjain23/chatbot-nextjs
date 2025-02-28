'use client';

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUrlDataHoc } from "@/hoc/addUrlDataHoc";
import { setThreadId, setThreads } from "@/store/interface/interfaceSlice";
import { $ReduxCoreType } from "@/types/reduxCore";
import { GetSessionStorageData } from "@/utils/ChatbotUtility";
import { useCustomSelector } from "@/utils/deepCheckSelector";
import { ParamsEnums } from "@/utils/enums";
import { createNewThreadApi } from "@/config/api";
import { CircleX, Plus } from "lucide-react";


const createRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

interface ChatbotDrawerProps {
  setLoading: (loading: boolean) => void;
  chatbotId: string;
  isToggledrawer: boolean;
  setToggleDrawer: (isOpen: boolean) => void;
}

const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({ setLoading, chatbotId, setToggleDrawer, isToggledrawer }) => {
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
        state.Interface?.interfaceContext?.[chatbotId]?.[
          GetSessionStorageData("bridgeName") ||
          state.Interface?.bridgeName ||
          "root"
        ]?.threadList?.[
        GetSessionStorageData("threadId") || state.Interface?.threadId
        ] || [],
    }));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setToggleDrawer(false);
      } else {
        setToggleDrawer(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setToggleDrawer]);

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
    }
    
  };

  const handleChangeSubThread = (sub_thread_id: string) => {
    setLoading(false);
    dispatch(setThreadId({ subThreadId: sub_thread_id }));
    // setToggleDrawer(false)
  };

  const DrawerList = (
    <div className="menu p-4 w-full h-full bg-base-200 text-base-content">
      {(subThreadList || []).length === 0 ? (
        <div className="flex justify-center items-center mt-5">
          <span>No Threads</span>
        </div>
      ) : (
        <ul>
          {subThreadList.map((thread: any) => (
            <li key={thread?._id}>
              <a
                className={`${thread?.sub_thread_id === selectedSubThreadId ? 'active' : ''}`}
                onClick={() => handleChangeSubThread(thread?.sub_thread_id)}
              >
                {thread?.display_name || thread?.sub_thread_id}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="drawer z-[100]">
      <input
        id="chatbot-drawer"
        type="checkbox"
        className="drawer-toggle lg:hidden"
        checked={isToggledrawer}
        onChange={(e) => setToggleDrawer(e.target.checked)}
      />

      {/* Backdrop overlay for mobile */}
      {isToggledrawer && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden" 
          onClick={() => setToggleDrawer(false)}
        />
      )}

      <div className={`drawer-side max-w-[265px] ${isToggledrawer ? 'lg:translate-x-0' : 'lg:-translate-x-full'} transition-transform duration-100`}>
        <div className="p-4 w-[265px] min-h-full bg-base-200 text-base-content relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">History</h2>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm btn-circle lg:hidden"
                onClick={() => setToggleDrawer(false)}
              >
                <CircleX />
              </button>
            </div>
          </div>
          {DrawerList}
        </div>
      </div>
    </div>
  );
};

export default React.memo(
  addUrlDataHoc(React.memo(ChatbotDrawer), [ParamsEnums.chatbotId])
);
