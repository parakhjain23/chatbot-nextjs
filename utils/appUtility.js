import { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

function CustomSuspense({ children }) {
  return <Suspense fallback={<CircularProgress />}>{children}</Suspense>;
}
export default CustomSuspense;


export const toggleSidebar = (sidebarId) => {
  const sidebar = document.getElementById(sidebarId);
  const handleClickOutside = (event) => {
    const sidebar = document.getElementById(sidebarId);
    const button = event.target.closest('button');

    if (sidebar && !sidebar.contains(event.target) && !button) {
      sidebar.classList.add('-translate-x-full');
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscPress);
    }
  };

  const handleEscPress = (event) => {
    if (event.key === 'Escape') {
      sidebar.classList.add('-translate-x-full');
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscPress);
    }
  };

  if (sidebar) {
    sidebar.classList.toggle('-translate-x-full');

    if (!sidebar.classList.contains('-translate-x-full')) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscPress);
    } else {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscPress);
    }
  }
};