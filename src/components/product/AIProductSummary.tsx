import { Product } from "src/frontend-utils/types/product";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { Typography } from "@mui/material";
import { Category } from "src/frontend-utils/types/store";
import useSettings from "src/hooks/useSettings";
import Markdown from 'react-markdown';

export default function AIProductSummary({ product }: { product: Product }) {
  const { themeMode } = useSettings();
  const isLight = themeMode === "light";
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const category = apiResourceObjects[product.category] as Category;
  return product.ai_description ? (
    
   
      <Markdown>
        {product.ai_description}
      </Markdown>
  ) : (
    <Typography>
      La descripción de este producto no está disponible.
    </Typography>
  );
}
