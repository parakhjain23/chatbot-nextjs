"use client";
import { Box } from "@mui/material";
import React, { useContext } from "react";
import { ParamsEnums } from "../../../enums";
import addUrlDataHoc from "../../../hoc/addUrlDataHoc";
import ComponentRenderer from "../ComponentRenderer";
import { GridContext } from "./Grid";

function Viewonlygrid({ dragRef }) {
  const responseTypeJson: any = useContext(GridContext);
  const components = responseTypeJson?.components || responseTypeJson;

  return (
    <Box className="column grid_parent">
      {Object.keys(components || {}).map((componentKey: string) => {
        return (
          <div key={componentKey} className="grid-item column not_drag">
            <ComponentRenderer
              componentId={componentKey}
              dragRef={dragRef}
              inpreview
            />
          </div>
        );
      })}
    </Box>
  );
}
export default React.memo(
  addUrlDataHoc(React.memo(Viewonlygrid), [ParamsEnums?.interfaceId])
);
