import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useDfpSlot = (
  category: string,
  divId: string,
  isMobile: Boolean
) => {
  const router = useRouter();
  const [transition, setTransition] = useState(false);

  const removeSlot = () => {
    const { googletag } = window as any;
    googletag.cmd.push(function () {
      googletag.destroySlots();
    });
  };

  useEffect(() => {
    const setTransitionStarted = () => {
      setTransition(true);
      removeSlot();
    };

    const setTransitionComplete = () => {
      setTransition(false);
    };

    if (!transition && window) {
      const googletag = (window as any).googletag || {};
      googletag.cmd.push(function () {
        googletag.destroySlots();
      });
      const sizes = isMobile ? [320, 50] : [[728, 90], [970, 90]];

      googletag.cmd.push(function () {
        try {
          googletag
            .defineSlot("/21667261583/top_banner", sizes, divId)
            .setTargeting("category", [category])
            .addService(googletag.pubads());
          googletag.pubads().enableSingleRequest();
          googletag.enableServices();
          googletag.display(divId);
        } catch {
          removeSlot();
        }
      });
    }

    router.events.on("routeChangeStart", setTransitionStarted);
    router.events.on("routeChangeComplete", setTransitionComplete);
    return () => {
      router.events.off("routeChangeStart", setTransitionStarted);
      router.events.off("routeChangeComplete", setTransitionComplete);
    };
  }, [category, divId, isMobile, router.events, transition]);
};
