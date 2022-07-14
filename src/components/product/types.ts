import currency from "currency.js";
import { Entity } from "src/frontend-utils/types/entity";
import { Product } from "src/frontend-utils/types/product";
import { Store } from "src/frontend-utils/types/store";

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

export type RatedStore = Store & {
  rating: number;
};

export type MinimumPricesPerDay = {
  normalPrices: {
    [tiemstamp: string]: { timestamp: string; normalPrice: currency };
  };
  offerPrices: {
    [tiemstamp: string]: { timestamp: string; offerPrice: currency };
  };
};

export type PricingHistory = {
  timestamp: string;
  normal_price: string;
  offer_price: string;
  stock: number;
  is_available: boolean;
};

export type PricingData = {
  entity: Entity;
  pricing_history: PricingHistory[];
};

export type NormalizedPricingData = {
  entity: Entity;
  normalized_pricing_history: MinimumPricesPerDay;
};
