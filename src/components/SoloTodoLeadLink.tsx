import {
    Box,
    Button,
    IconButton,
    Modal,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import {ReactNode, useState} from "react";
import {constants} from "src/config";
import {useApiResourceObjects} from "src/frontend-utils/redux/api_resources/apiResources";
import {Entity, InLineProduct} from "src/frontend-utils/types/entity";
import {Category, Store} from "src/frontend-utils/types/store";
import {useAppSelector} from "src/frontend-utils/redux/hooks";
import {modalStyle} from "src/styles/modal";
import LeadLink from "./LeadLink";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {ga4Event} from "../utils/ga4";

type SoloTodoLeadLinkProps = {
    entity: Entity;
    product: InLineProduct;
    storeEntry: Store;
    children: ReactNode;
    buttonType?: boolean;
};

export default function SoloTodoLeadLink(props: SoloTodoLeadLinkProps) {
    const {entity, product, storeEntry, children, buttonType} = props;
    const theme = useTheme();
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
            const params = {
                // page_location: `${constants.domain}${router.asPath}`,
                // page_path: router.asPath,
                product: product.name,
                product_id: product.id,
                category: category.name,
                category_id: category.id,
                retailer: storeEntry.name,
                retailer_id: storeEntry.id,
                entity_id: entity.id,
                seller: entity.seller || null,
                condition: entity.condition,
                sku: entity.sku || null,
                precio: price
            };
            ga4Event('click', params)
            ga4Event('generate_lead', {
                ...params,
                value: price,
                currency: "CLP",
            })
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
            <Modal open={open} onClose={handleClose}>
                <Box sx={{...modalStyle, textAlign: "center"}}>
                    <Typography id="modal-modal-title" variant="h2" fontWeight={600}>
                        🎉 ¡Producto con cupón!
                    </Typography>
                    <Typography fontWeight={600}>
                        Para hacer válido este precio usa el siguiente cupón en el carrito
                        de compras de la tienda:
                    </Typography>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        marginY={4}
                        spacing={1}
                    >
                        <Box bgcolor="background.default" borderRadius="10px" padding={2}>
                            <Typography variant="h2" fontWeight={600} textAlign="center">
                                {entity.best_coupon?.code}
                            </Typography>
                        </Box>
                        <IconButton
                            color="secondary"
                            sx={{
                                borderRadius: "10px",
                                background: theme.palette.background.default,
                                padding: 2,
                            }}
                            onClick={() => {
                                navigator.clipboard.writeText(entity.best_coupon?.code || "");
                            }}
                        >
                            <ContentCopyIcon fontSize="large"/>
                        </IconButton>
                    </Stack>
                    <Stack direction="row" justifyContent="space-evenly" spacing={1}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleClose}
                            sx={{borderRadius: 4}}
                        >
                            CANCELAR
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
                                sx={{borderRadius: 4}}
                            >
                                VER PRODUCTO
                            </Button>
                        </LeadLink>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
}
