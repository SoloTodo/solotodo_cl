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

type Item = {
  item_id: string;
  item_name: string;
  affiliation: string;
  coupon: string;
  currency: string;
  index?: number;
  // item_brand: string;
  item_category: string;
  item_variant?: string;
  price: number;
  // quantity: number;
};

type ViewItemProps = {
  category?: string;
  categoryId?: string;
  items: Item[];
};

export const useGtag4ViewItemList = (props: ViewItemProps) => {
  const router = useRouter();

  useEffect(() => {
    const addEvent = () => {
      const params = {
        page_location: `${constants.domain}${router.asPath}`,
        page_path: router.asPath,
        category: props.category,
        category_id: props.categoryId,
        items: props.items,
        send_to: constants.GA4Id,
      };

      (window as any).gtag("event", "view_item_list", params);
    };

    if (window.history.state.idx === 0) addEvent();

    router.events.on("routeChangeComplete", addEvent);
    return () => {
      router.events.off("routeChangeComplete", addEvent);
    };
  }, [props, router.asPath, router.events]);
};
