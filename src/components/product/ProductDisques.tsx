import useSettings from "src/hooks/useSettings";
import { DiscussionEmbed } from 'disqus-react';
import { constants } from "src/config";
import { Product } from "src/frontend-utils/types/product";
import { useEffect, useState } from "react";

export default function ProductDisques({ product }: { product: Product }) {
  const { themeMode } = useSettings();
  const [mode, setMode] = useState(themeMode);

  useEffect(() => setMode(themeMode), [themeMode]);

  const config = {
      url: `https://www.solotodo.com/products/${product.id}`,
      identifier: product.id.toString(),
      title: product.name
  }

  return mode === themeMode ? (
    <DiscussionEmbed
      shortname={constants.disqusShortName}
      config={config}
    />
  ) : null;
}
