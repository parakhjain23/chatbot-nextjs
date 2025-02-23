import { Box } from "@mui/material";
import Grid from "../Grid/Grid";

export default function InterfaceForm({
  props,
  componentId = "",
  dragRef = { current: "" },
  ingrid = false,
}) {
  return (
    <Box
      className={`${
        ingrid ? "interface-chatbot" : ""
      } p-3 h-100 w-100 box-sizing-border-box interface-form `}
      {...props}
    >
      {/* {!inpreview && (
        <Box className='flex-end-center w-100'>
          {ingrid && (
            <Button
              variant='outlined'
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={() => dispatch(toggleNestedGridSliderOpen({ id: componentId, gridId: gridId }))}
            >
              Edit
            </Button>
          ) 
          // : (
          //   <Button variant='outlined' onClick={() => dispatch(toggleNestedGridSliderOpen(false))}>
          //     Close
          //   </Button>
          // )
          }
        </Box>
      )} */}
      <form
        className="nested_grid"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Grid
          dragRef={dragRef}
          ingrid={ingrid}
          gridId={componentId}
          loadInterface={false}
        />
      </form>
    </Box>
  );
}
