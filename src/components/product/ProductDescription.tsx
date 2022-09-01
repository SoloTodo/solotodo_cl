import { Product } from "src/frontend-utils/types/product";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { constants } from "src/config";
import { Typography } from "@mui/material";
import styles from "../../styles/ProductPage.module.css";
import Handlebars from "handlebars";
import { useEffect, useState } from "react";
import { fetchJson } from "src/frontend-utils/network/utils";

export default function ProductDescription({ product }: { product: Product }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [template, setTemplate] = useState<{ body: string } | null>(null);

  useEffect(() => {
    fetchJson(
      `${
        constants.apiResourceEndpoints.category_templates
      }?website=2&purpose=1&category=${apiResourceObjects[product.category].id}`
    ).then((category_template) => {
      category_template.length !== 0 && setTemplate(category_template[0]);
    });
  }, [apiResourceObjects, product.category, product.id]);

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
