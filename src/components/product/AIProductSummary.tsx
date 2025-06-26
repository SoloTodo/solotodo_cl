import {Product} from "src/frontend-utils/types/product";
import {Stack, Typography, Popover} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Markdown from 'react-markdown';
import {useState} from "react";

export default function AIProductSummary({product}: { product: Product }) {
    const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);

    if (!product.ai_description) {
        return null
    }

    const handleEnter = (event: React.MouseEvent<SVGSVGElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleExit = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return <Stack spacing={3}>
        <Stack direction="row" spacing={1} sx={{
            alignItems: "center",
        }}>
            <Typography variant="h4" sx={{verticalAlign: 'middle'}}>Descripción</Typography>
            <AutoAwesomeIcon onClick={handleEnter}/>
        </Stack>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleExit}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}>
            <Typography sx={{p: 2}}>Esta descripción está generada por una IA y puede contener errores, confirme las
                características del producto con la tienda.</Typography>
        </Popover>
        <Markdown>
            {product.ai_description}
        </Markdown>
    </Stack>
}