import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import { constants } from "src/config";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity, InLineProduct } from "src/frontend-utils/types/entity";
import { Category, Store } from "src/frontend-utils/types/store";
import { useAppSelector } from "src/store/hooks";
import { modalStyle } from "src/styles/modal";
import LeadLink from "./LeadLink";

type SoloTodoLeadLinkProps = {
  entity: Entity;
  product: InLineProduct;
  storeEntry: Store;
  children: ReactNode;
  buttonType?: boolean;
};

export default function SoloTodoLeadLink(props: SoloTodoLeadLinkProps) {
  const { entity, product, storeEntry, children, buttonType } = props;
  const [open, setOpen] = useState(false);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const category = apiResourceObjects[entity.category] as Category;

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (uuid: any, evt: Event) => {
    const price = parseFloat(entity.active_registry!.offer_price);

    if (entity.best_coupon && !open) {
      evt.preventDefault();
      setOpen(true);
    } else {
      const win: any = window;
      win.gtag("event", "Follow", {
        dimension2: category.name,
        dimension3: product.name,
        dimension4: storeEntry.name,
        dimension5: `${product.name}|${category.name}|${storeEntry.name}`,
        event_category: "Lead",
        event_label: uuid,
        value: price,
      });
    }
  };

  return (
    <>
      <LeadLink
        entity={entity}
        store={storeEntry}
        websiteId={constants.websiteId}
        callback={handleClick}
        soicosPrefix="ST_"
        buttonType={buttonType ? buttonType : false}
      >
        {children}
      </LeadLink>
      <Modal open={true} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h2" fontWeight={600}>
            🎉 ¡Producto con cupón!
          </Typography>
          <Typography fontWeight={600}>
            Para hacer válido este precio usa el siguiente cupón en el carrito
            de compras de la tienda:
          </Typography>
          <Typography variant="h2" textAlign="center">
            {entity.best_coupon?.code}
          </Typography>
          <br />
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClose}
              sx={{ borderRadius: 4 }}
            >
              Cancelar
            </Button>
            <LeadLink
              entity={entity}
              store={storeEntry}
              websiteId={constants.websiteId}
              callback={handleClick}
              soicosPrefix="ST_"
              buttonType={buttonType ? buttonType : false}
            >
              <Button
                variant="outlined"
                color="secondary"
                sx={{ borderRadius: 4 }}
              >
                ¡Entendido! Llévame a la página de la tienda
              </Button>
            </LeadLink>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
