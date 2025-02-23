import Image from "next/image";

interface InterfaceIconProps {
  props: any;
}
function InterfaceIcon({ props }: InterfaceIconProps) {
  return (
    <Image
      className="h-100 w-100"
      alt="Remy Sharp"
      {...props}
      style={{ objectFit: "contain" }}
    />
  );
}

export default InterfaceIcon;
