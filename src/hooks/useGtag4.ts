import { useRouter } from "next/router";
import { useEffect } from "react";
import { constants } from "src/config";

type Props = {
  product?: string;
  productId?: string;
  category?: string;
  categoryId?: string;
  store?: string;
  storeId?: string;
  seller?: string;
  sku?: string;
  condition?: string;
  offerPrice?: string;
};

export const useGtag4 = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    const addEvent = () => {
      const params = {
        page_location: `${constants.domain}${router.asPath}`,
        page_path: router.asPath,
        product: props.product,
        product_id: props.productId,
        category: props.category,
        category_id: props.categoryId,
        retailer: props.store,
        retailer_id: props.storeId,
        seller: props.seller,
        condition: props.condition,
        precio: props.offerPrice,
        send_to: constants.GA4Id,
      };

      (window as any).gtag("event", "page_view", params);
    };

    if (window.history.state.idx === 0) addEvent();

    router.events.on("routeChangeComplete", addEvent);
    return () => {
      router.events.off("routeChangeComplete", addEvent);
    };
  }, [props, router.asPath, router.events]);
};
