import { Product } from "src/frontend-utils/types/product";
import { PricingEntriesProps } from "./types";
import uniqBy from "lodash/uniqBy";
import Link from "next/link";
import { Button, Stack } from "@mui/material";
import ProductAxisChoicesModalButton from "./ProductAxisChoicesModalButton";

type ProductAxisChoicesProps = {
  axis: { label: string; labelField: string; orderingField: string };
  product: Product;
  pricingEntries: PricingEntriesProps[];
  otherLabelFields: string[];
};

export default function ProductAxisChoices({
  axis,
  product,
  pricingEntries,
  otherLabelFields,
}: ProductAxisChoicesProps) {
  const labelAndOrderingValues = pricingEntries.map((pricingEntry) => ({
    labelValue: pricingEntry.product.specs[axis.labelField],
    orderingValue: pricingEntry.product.specs[axis.orderingField],
  }));

  const uniqueLabelAndOrderingValues = uniqBy(
    labelAndOrderingValues,
    "labelValue"
  ).sort(function (productTuple1, productTuple2) {
    const value1 = productTuple1.orderingValue;
    const value2 = productTuple2.orderingValue;
    if (value1 < value2) {
      return -1;
    } else if (value2 > value1) {
      return 1;
    } else {
      return 0;
    }
  });

  const axesChoices = uniqueLabelAndOrderingValues.map(
    (uniqueLabelAndOrderingValue) => {
      const matchingAxisPricingEntries = pricingEntries.filter(
        (pricingEntry) =>
          pricingEntry.product.specs[axis.labelField] ===
          uniqueLabelAndOrderingValue.labelValue
      );

      const originalProductMatches =
        product.specs[axis.labelField] ===
        uniqueLabelAndOrderingValue.labelValue;

      const matchingAxisPricingEntry =
        matchingAxisPricingEntries.filter((pricingEntry) =>
          otherLabelFields.every(
            (labelField) =>
              pricingEntry.product.specs[labelField] ===
              product.specs[labelField]
          )
        )[0] || null;

      const redirectUrlData = matchingAxisPricingEntry && {
        id: matchingAxisPricingEntry.product.id,
        slug: matchingAxisPricingEntry.product.slug,
      };

      return {
        ...uniqueLabelAndOrderingValue,
        matchingAxisPricingEntries,
        originalProductMatches,
        redirectUrlData,
      };
    }
  );

  return (
    <Stack spacing={1} direction="row">
      {axesChoices.map((choice) => {
        if (choice.originalProductMatches) {
          return (
            <Button variant="contained" key={choice.labelValue}>
              {choice.labelValue}
            </Button>
          );
        } else if (choice.redirectUrlData) {
          return (
            <Link
              key={choice.labelValue}
              href={`/products/[slug]?slug=${choice.redirectUrlData.id}-${choice.redirectUrlData.slug}`}
              as={`/products/${choice.redirectUrlData.id}-${choice.redirectUrlData.slug}`}
            >
              <Button variant="outlined">{choice.labelValue}</Button>
            </Link>
          );
        } else {
          return (
            <ProductAxisChoicesModalButton
              key={choice.labelValue}
              choice={choice}
              axis={axis}
            />
          );
        }
      })}
    </Stack>
  );
}
