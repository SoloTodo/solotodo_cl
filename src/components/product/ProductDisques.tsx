import useSettings from "src/hooks/useSettings";
import ReactDisqusComments from "react-disqus-comments";
import { constants } from "src/config";
import { Product } from "src/frontend-utils/types/product";
import { useEffect, useState } from "react";

export default function ProductDisques({ product }: { product: Product }) {
  const { themeMode } = useSettings();
  const [mode, setMode] = useState(themeMode);

  useEffect(() => setMode(themeMode), [themeMode]);

  return mode === themeMode ? (
    <ReactDisqusComments
      shortname={constants.disqusShortName}
      identifier={product.id.toString()}
      title={product.name}
      url={`https://www.solotodo.com/products/${product.id}`}
    />
  ) : null;
}
