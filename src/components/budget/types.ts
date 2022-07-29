import { InLineProduct } from "src/frontend-utils/types/entity";
import { User } from "src/frontend-utils/types/user";

export type Entry = {
  id: number;
  url: string;
  budget: string;
  category: string;
  selected_product: string;
  selected_store: string;
};

export type Budget = {
  id: number;
  url: string;
  name: string;
  creation_date: string;
  last_updated: string;
  is_public: boolean;
  user: User;
  products_pool: InLineProduct[];
  entries: Entry[];
};
