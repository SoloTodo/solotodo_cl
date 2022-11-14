import { useDfpSlot } from "src/hooks/useDfpSlot";
import useResponsive from "src/hooks/useResponsive";

export default function TopBanner({ category }: { category: string }) {
  const divId = `div-gpt-ad-1666029557456-0`;

  const isDesktopSmall = useResponsive("down", "sm") || false;
  useDfpSlot(category, divId, isDesktopSmall);
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
