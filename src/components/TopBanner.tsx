import { useDfpSlot } from "src/hooks/useDfpSlot";

export default function TopBanner({ category }: { category: string }) {
  const divId = `div-gpt-ad-1666029557456-0`;

  useDfpSlot(category, divId);
  return (
    <div
      id={divId}
      data-ad="true"
      style={{
        textAlign: "center",
        overflow: "hidden",
        height: 90,
        marginBottom: 8,
      }}
    />
  );
}
