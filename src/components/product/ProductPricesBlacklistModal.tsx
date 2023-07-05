import {RatedStore} from "./types";
import {Entity} from "../../frontend-utils/types/entity";
import StoreIcon from '@mui/icons-material/Store';
import {Box, Button, Modal, Stack, Typography} from "@mui/material";
import {useState} from "react";
import {modalStyle} from "../../styles/modal";
import WarningIcon from "@mui/icons-material/Warning";
import {calcEntityPrice} from "../../utils/calcEntityPrice";
import ProductPriceCard from "./ProductPriceCard";

type ProductPricesBlacklistModalProps = {
    blacklistEntities: Entity[] | null;
    ratedStores: Record<string, RatedStore>
};

export default function ProductPricesBlacklistModal(
    {blacklistEntities, ratedStores}: ProductPricesBlacklistModalProps) {

    const [isOpen, setOpen] = useState(false)

    if (blacklistEntities === null || blacklistEntities.length === 0) {
        return null
    }

    return <>
        <Button
            variant="contained"
            color="info"
            sx={{borderRadius: 4, fontWeight: 400}}
            onClick={() => setOpen(true)}
            startIcon={<StoreIcon/>}
        >
            Ver otras tiendas
        </Button>
        <Modal open={isOpen} onClose={() => setOpen(false)}>
            <Box sx={modalStyle}>
                <Stack spacing={2}>
                    <Typography variant="h3" component="h2">
                        Otras tiendas con este producto
                    </Typography>
                    {blacklistEntities
                        .sort(
                            (a, b) =>
                                calcEntityPrice(a, 'offer_price') - calcEntityPrice(b, 'offer_price')
                        ).map(entity => <ProductPriceCard
                                entity={entity}
                                ratedStores={ratedStores}
                            />
                        )}
                    <Typography>
                        <strong>¿Por qué estas tiendas aparecen acá?</strong>
                    </Typography>
                    <Typography>
                        Son tiendas con las que aún no hemos llegado a acuerdo para aparecer en SoloTodo, pero que aún
                        queremos considerar para darles a nuestros visitantes toda la información que tenemos disponible.
                    </Typography>
                </Stack>
            </Box>
        </Modal>
    </>
}