import { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

function CustomSuspense({ children }) {
  return <Suspense fallback={<CircularProgress />}>{children}</Suspense>;
}
export default CustomSuspense;
