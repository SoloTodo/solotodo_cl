import { useState } from "react";

type ProductAxisChoicesModalButtonProps = {
  choice: any;
  axis: any;
};

export default function ProductAxisChoicesModalButton({
  choice,
  axis,
}: ProductAxisChoicesModalButtonProps) {
  const [open, setOpen] = useState(false);


  return <p>Modal</p>;
}
