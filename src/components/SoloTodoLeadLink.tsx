import { ReactNode } from "react";
import { constants } from "src/config";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity, InLineProduct } from "src/frontend-utils/types/entity";
import { Category, Store } from "src/frontend-utils/types/store";
import { useAppSelector } from "src/store/hooks";
import LeadLink from "./LeadLink";

type SoloTodoLeadLinkProps = {
  entity: Entity;
  product: InLineProduct;
  storeEntry: Store;
  children: ReactNode;
  buttonType?: boolean;
};

export default function SoloTodoLeadLink(props: SoloTodoLeadLinkProps) {
  const { entity, product, storeEntry, children, buttonType } = props;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const category = apiResourceObjects[entity.category] as Category;

  const handleClick = (uuid: any) => {
    const price = parseFloat(entity.active_registry!.offer_price);

    const win: any = window;
    win.gtag("event", "Follow", {
      dimension2: category.name,
      dimension3: product.name,
      dimension4: storeEntry.name,
      dimension5: `${product.name}|${category.name}|${storeEntry.name}`,
      event_category: "Lead",
      event_label: uuid,
      value: price,
    });
  };

  return (
    <LeadLink
      entity={entity}
      store={storeEntry}
      websiteId={constants.websiteId}
      callback={handleClick}
      soicosPrefix="ST_"
      buttonType={buttonType ? buttonType : false}
    >
      {children}
    </LeadLink>
  );
}
