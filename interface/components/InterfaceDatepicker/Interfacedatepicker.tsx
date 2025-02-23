import { Box } from "@mui/material";
import debounce from "lodash.debounce";
import React from "react";
import { useDispatch } from "react-redux";
import { addInterfaceContext } from "../../../store/interface/interfaceSlice";

interface InterfaceDatePickerProps {
  props: any;
  gridId: string;
  componentId: string;
}
function Interfacedatepicker({
  props,
  gridId,
  componentId,
}: InterfaceDatePickerProps) {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = React.useState("");

  const handleDateChange = (e) => {
    const { value } = e.target;
    setSelectedDate(value);
    debouncedDispatch(value);
  };
  const debouncedDispatch = debounce((value) => {
    dispatch(addInterfaceContext({ gridId, componentId, value }));
  }, 400);

  return (
    <Box className="w-100 h-100 flex-center-center">
      <input
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        type="date"
        {...props}
        value={selectedDate}
        onChange={handleDateChange}
      />
    </Box>
  );
}

export default Interfacedatepicker;
