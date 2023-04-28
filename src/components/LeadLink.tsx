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
  appendUuidToUrl?: boolean;
  targetUrl?: string;
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
    appendUuidToUrl,
    targetUrl,
  } = props;

  useEffect(() => {
    setUuid(uuidv4());
  }, []);

  const handleClick = (evt: any) => {
    // TODO: This condition is for ignoring registering leads on harcoded stores. Ideally it should be removed soon
    if (Number.isInteger(entity.id)) {
      registerLead(websiteId, entity, uuid);
    }

    if (callback) {
      callback(uuid, evt);
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

    if (targetUrl) {
      url = targetUrl;
      if (appendUuidToUrl) {
        url += "&uuid=" + uuid;
      }
      target = "_blank";
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
    } else if (store.id === constants.lenovoChileStoreId) {
      url = `https://ad.soicos.com/-15Dd?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
    } else if (store.id === constants.reuseStoreId) {
      url = `https://ad.soicos.com/-1i2E?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
    } else if (store.id === constants.fensaStoreId) {
      url = `https://ad.soicos.com/-1jF3?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
    } else if (store.id === constants.easyId) {
      url = `https://ad.soicos.com/-1mfo?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
    } else if (store.id === constants.huaweiShopStoreId) {
      url = `https://ad.soicos.com/-1cEy?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
    } else if (store.id === constants.philipsStoreId) {
      url = `https://ad.soicos.com/-1n4o?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_top";
    } else if (store.id === constants.hpOnlineStoreId) {
      url = `https://www.awin1.com/cread.php?awinmid=15305&awinaffid=641001&clickref=&p=%5B%5B${encodeURIComponent(
        entity.external_url
      )}%5D%5D`;
      target = "_self";
    } else if (
      store.id === constants.falabellaStoreId ||
      store.id === constants.sodimacStoreId ||
      store.id === constants.tottusStoreId
    ) {
      url = `https://ad.soicos.com/-1gD6?dl=${encodeURIComponent(
        entity.external_url
      )}&trackerID=${soicosPrefix || ""}${
        entity.active_registry!.id
      }${urlSuffix}`;
      target = "_self";
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
    } else if (store.id === constants.tiendaOficialLgId) {
      url = entity.external_url.replace("lg.com", "lgonline.cl");
      target = "_blank";
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
