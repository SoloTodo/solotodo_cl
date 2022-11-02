import { useDfpSlot } from "src/hooks/useDfpSlot";
import useMobileDetect from "src/hooks/useMobileDetect";

export default function TopBanner({ category }: { category: string }) {
  const divId = `div-gpt-ad-1666029557456-0`;

  const isMobile = useMobileDetect().isMobile();
  useDfpSlot(category, divId, isMobile);
  return (
    <div
      id={divId}
      data-ad="true"
      style={{
        textAlign: "center",
        overflow: "hidden",
        marginBottom: 24,
      }}
    />
  );
}
