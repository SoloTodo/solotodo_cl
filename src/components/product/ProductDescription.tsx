import { Product } from "src/frontend-utils/types/product";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { Typography } from "@mui/material";
import styles from "../../styles/ProductPage.module.css";
import Handlebars from "handlebars";
import { Category } from "src/frontend-utils/types/store";

export default function ProductDescription({ product }: { product: Product }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const category = apiResourceObjects[product.category] as Category;

  const template = category.detail_template;

  const formatSpecs = () => {
    let html = "";
    if (template) {
      const templateHandler = Handlebars.compile(template);
      html = templateHandler(product.specs);
    }

    return { __html: html };
  };

  return template ? (
    <div
      className={styles.product_specs}
      dangerouslySetInnerHTML={formatSpecs()}
    />
  ) : (
    <Typography>
      Las especificaciones técnicas de este producto no están disponibles por
      ahora.
    </Typography>
  );
}
