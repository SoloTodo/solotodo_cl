import React, {useState} from 'react'
import {Product} from "../../frontend-utils/types/product";
import styles from "../../pages/products/[slug]/product.module.scss";
import ReactMarkdown from "react-markdown";
import {Box, Grid, Modal, Stack, Typography} from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {modalStyle} from "../../styles/modal";

type ProductBenchmarksProps = {
  product: Product;
};


export default function ProductAiDescription({product}: ProductBenchmarksProps) {
    if (!product.ai_description) {
        return null
    }

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
      };

    const handleClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
        evt.preventDefault()
        setOpen(true)
    }

    return <><Grid item xs={12}>
        <div className={styles.ai_description}>
            <h2>Resumen del producto <a href="#" onClick={handleClick}><HelpOutlineIcon fontSize={"small"}/></a></h2>
            <ReactMarkdown>{product.ai_description}</ReactMarkdown>
        </div>
    </Grid>
        <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
            <Stack spacing={1}>
              <Typography id="modal-modal-title" variant="h3" component="h2">
                Resumen automático
              </Typography>
              <Typography id="modal-modal-description">
                  <p>
                SoloTodo generó este resumen de manera automática a partir de nuestra propia ficha de producto y a la
                      información provista por las distintas tiendas que lo venden.
                      </p>
                      <br />
                  <p>
                      Considera que esta información es referencial solamente. Confirma las características del producto en la página del fabricante o de las tiendas.
                  </p>
              </Typography>
            </Stack>
        </Box>
      </Modal>
    </>
}