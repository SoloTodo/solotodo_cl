import { useRouter } from "next/router";
import { useEffect } from "react";
import { constants } from "src/config";

type Props = {
  category?: string;
  product?: string;
  store?: string;
};

export const useGtag3 = ({ category, product, store }: Props) => {
  const router = useRouter();

  useEffect(() => {
    const addEvent = () => {
      (window as any).gtag("event", "page_view", {
        dimension1: undefined,
        dimension2: category,
        dimension3: product,
        dimension4: store,
        dimension5: undefined,
        sent_to: constants.GA3Id,
      });
    };

    if (window.history.state.idx === 0) addEvent();

    router.events.on("routeChangeComplete", addEvent);
    return () => {
      router.events.off("routeChangeComplete", addEvent);
    };
  }, [category, product, router.events, store]);
};
