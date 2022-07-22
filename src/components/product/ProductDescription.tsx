import { Product } from "src/frontend-utils/types/product";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { constants } from "src/config";
import { Typography } from "@mui/material";
import styles from "../../styles/ProductPage.module.css";
import Handlebars from "handlebars";
import { CategoryTemplate } from "./types";

export default function ProductDescription({ product }: { product: Product }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const template =
    (
      getApiResourceObjects(
        apiResourceObjects,
        "category_templates"
      ) as unknown as CategoryTemplate[]
    ).filter(
      (ct) =>
        ct.category == product.category &&
        ct.website === `${constants.apiResourceEndpoints.websites}2/` &&
        ct.purpose === constants.detailPurposeUrl
    )[0] || null;

  const formatSpecs = () => {
    let html = "";
    if (template) {
      const templateHandler = Handlebars.compile(template.body);
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
