import { Entity } from "src/frontend-utils/types/entity";
import { Product } from "src/frontend-utils/types/product";

type PricesPerCurrency = {
  currency: string;
  normal_price: string;
  offer_price: string;
};

type metadata = {
  score: number;
  normal_price_usd: string;
  offer_price_usd: string;
  prices_per_currency: PricesPerCurrency[];
};

type ExtendedProduct = Product & {
  brand_id: number;
  brand_name: string;
  name_analyzed: string;
  specs: Record<string, any>;
};

export type ProductsData = {
  bucket: string;
  product_entries: {
    metadata: metadata;
    product: ExtendedProduct;
  }[];
};

export type PricingEntriesProps = {
  product: Product;
  entities: Entity[];
};