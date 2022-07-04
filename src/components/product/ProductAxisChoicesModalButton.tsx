import Link from "next/link";
import { Button, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { PricingEntriesProps } from "./types";

type ProductAxisChoicesModalButtonProps = {
  choice: any;
  axis: any;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProductAxisChoicesModalButton({
  choice,
  axis,
}: ProductAxisChoicesModalButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        {choice.labelValue}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack sx={style} spacing={1}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Producto exacto no disponible
          </Typography>
          <Typography id="modal-modal-description">
            Te mostramos variantes en {axis.label} {choice.labelValue} que sí
            están disponibles para compra:
          </Typography>
          <br />
          {choice.matchingAxisPricingEntries.map(
            (pricingEntry: PricingEntriesProps) => (
              <p key={pricingEntry.product.id}>
                <Link
                  href={`/products/[slug]?slug=${pricingEntry.product.id}-${pricingEntry.product.slug}`}
                  as={`/products/${pricingEntry.product.id}-${pricingEntry.product.slug}`}
                >
                  <Button variant="text">{pricingEntry.product.name}</Button>
                </Link>
              </p>
            )
          )}
        </Stack>
      </Modal>
    </>
  );
}
