import { Entity } from "src/frontend-utils/types/entity";

export const calcEntityPrice = (e: Entity, type: "offer_price" | "normal_price") => {
    let price = Number(e.active_registry![type]);
    if (e.best_coupon) {
      if (e.best_coupon.amount_type === 1) {
        price = price - Number(e.best_coupon.amount);
      } else {
        price = price - Number(e.best_coupon.amount) * price / 100;
      }
    }
    return price;
  };