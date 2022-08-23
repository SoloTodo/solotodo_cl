import { Link } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { constants } from "src/config";
import { Entity } from "src/frontend-utils/types/entity";
import { Store } from "src/frontend-utils/types/store";
import { registerLead } from "src/utils/registerLead";
import { v4 as uuidv4 } from "uuid";

type LeadLinkProps = {
  children: ReactNode;
  entity: Entity;
  store: Store;
  websiteId: number;
  callback: Function;
  soicosPrefix: string;
  buttonType: boolean;
};

export default function LeadLink(props: LeadLinkProps) {
  const [uuid, setUuid] = useState<string | null>(null);
  const {
    children,
    entity,
    store,
    websiteId,
    callback,
    soicosPrefix,
    buttonType,
  } = props;

  useEffect(() => {
    setUuid(uuidv4());
  }, []);

  const handleClick = () => {
    // TODO: This condition is for ignoring registering leads on harcoded stores. Ideally it should be removed soon
    if (Number.isInteger(entity.id)) {
      registerLead(websiteId, entity, uuid);
    }

    if (callback) {
      callback(uuid);
    }

    // setTimeout(() => this.resetUuid(), 300);
  };

  const generateUrl = () => {
    let urlSuffix = "";
    if (uuid) {
      urlSuffix = `_${uuid}`;
    }

    let url = undefined;
    let target = undefined;

    if (store.id === constants.linioStoreId) {
      let separator = null;
      if (entity.external_url.indexOf("?") === -1) {
        separator = "?";
      } else {
        separator = "&";
      }

      const deeplinkPath = "cl/" + entity.external_url.split(".cl/")[1];
      const linioUrlWithUtm = `${entity.external_url}${separator}utm_source=affiliates&utm_medium=hasoffers&utm_campaign=${constants.linioAffiliateId}&aff_sub=`;
      const go2CloudUrl = `https://linio.go2cloud.org/aff_c?offer_id=18&aff_id=${
        constants.linioAffiliateId
      }&url=${encodeURIComponent(linioUrlWithUtm)}`;
      url = `https://ej28.adj.st/${deeplinkPath}?adjust_t=cz1j0l_5px5hy&adjust_campaign=2900&adjust_deeplink=linio%3A%2F%2F${encodeURIComponent(
        deeplinkPath
      )}&adjust_fallback=${encodeURIComponent(
        go2CloudUrl
      )}&adjust_redirect=${encodeURIComponent(go2CloudUrl)}`;
      target = "_top";
    } else if (store.id === constants.abcdinStoreId) {
      url = `https://ad.soicos.com/-149x?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
    } else if (store.id === constants.parisStoreId) {
      url = `https://ad.soicos.com/-149A?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
      // } else if (store.id === constants.ripleyStoreId || store.id === constants.mercadoRipleyStoreId) {
      //   url = `https://ad.soicos.com/-149I?dl=${encodeURIComponent(entity.external_url)}&trackerID=${soicosPrefix || ''}${entity.active_registry.id}${urlSuffix}`;
      //   target = '_top'
    } else if (store.id === constants.lenovoChileStoreId) {
      url = `https://ad.soicos.com/-15Dd?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
      // } else if (store.id === constants.laPolarStoreId) {
      //   url = `https://ohmyad.com/redirect/?cid=d41e71430c&url=${encodeURIComponent(entity.external_url)}`
      //   target = '_top'
      // } else if (store.id === constants.womStoreId) {
      //   url = `https://ohmyad.com/redirect/?cid=0ff71c16e6&url=${encodeURIComponent(entity.external_url)}`
      //   target = '_top'
      // } else if (store.id === constants.tiendaClaroStoreId) {
      //   url = `https://ohmyad.com/redirect/?cid=678b9f9f48&url=${encodeURIComponent(entity.external_url)}`
      //   target = '_top'
    } else if (store.id === constants.reuseStoreId) {
      url = `https://ad.soicos.com/-1i2E?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
      // } else if (store.id === constants.hitesStoreId) {
      //   url = `https://ad.soicos.com/-16ON?dl=${encodeURIComponent('https://www.hites.com/')}&trackerID=${soicosPrefix || ''}${entity.active_registry.id}${urlSuffix}`;
      //   target = '_top'
    } else if (store.id === constants.hpOnlineStoreId) {
      url = `https://www.awin1.com/cread.php?awinmid=15305&awinaffid=641001&clickref=&p=%5B%5B${encodeURIComponent(
        entity.external_url
      )}%5D%5D`;
      target = "_self";
    } else if (store.id === constants.falabellaStoreId) {
      url = `https://ad.soicos.com/-1gD6?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_self";
      // } else if (store.id === constants.huaweiShopStoreId) {
      //   url = `https://ad.soicos.com/-1cEy?dl=${encodeURIComponent(entity.external_url)}&trackerID=${soicosPrefix || ''}${entity.active_registry.id}${urlSuffix}`;
      //   target = '_top'
    } else if (store.id === constants.tottusStoreId) {
      url = `https://ad.soicos.com/-1dVX?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
    } else if (
      store.id === constants.entelStoreId ||
      store.id === constants.tiendaEntelStoreId
    ) {
      url = `https://ad.soicos.com/-1eK1?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
    } else {
      url = entity.external_url;
      target = "_blank";
    }

    return {
      href: url,
      target,
      onClick: handleClick,
      onAuxClick: handleClick,
    };
  };

  return buttonType ? (
    <a {...generateUrl()} rel="noopener nofollow">
      {children}
    </a>
  ) : (
    <Link {...generateUrl()} rel="noopener nofollow" color="info.main">
      {children}
    </Link>
  );
}
