import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";
import { addInterfaceContext } from "../../../store/interface/interfaceSlice";

interface InterfaeRadioProps {
  props: any;
  gridId: string;
  componentId: string;
}

function InterfaceRadio({ props, gridId, componentId }: InterfaeRadioProps) {
  const dispatch = useDispatch();

  const debouncedDispatch = debounce((value) => {
    dispatch(addInterfaceContext({ gridId, componentId, value }));
  }, 400);

  const handleChange = (e: any) => {
    const { value } = e.target;
    debouncedDispatch(value);
  };
  return (
    <Box className="w-100 h-100 flex-center-center p-2 box-sizing-border-box">
      <FormControl fullWidth>
        <RadioGroup
          {...props}
          defaultValue={props?.options[0] || ""}
          onChange={handleChange}
        >
          {props?.options.map((option: any) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio onMouseDown={(e) => e.stopPropagation()} />}
              label={option}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

export default InterfaceRadio;
