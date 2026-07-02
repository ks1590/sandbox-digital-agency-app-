"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Tab from "../../../components/ui/Tab";
import type { TabItem } from "../../../components/ui/Tab/Tab";

interface Props {
  items: TabItem[];
  headingId: string;
  defaultIndex: number;
}

export default function MetadataViewTabs({ items, headingId, defaultIndex }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = (index: number) => {
    const tabMap = ["overview", "er", "table-def"];
    const newTab = tabMap[index] || "overview";
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.delete("subtab"); // clean up any subtab param just in case
    
    // Replace URL to preserve tab state without pushing to history stack
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tab
      headingId={headingId}
      defaultIndex={defaultIndex}
      items={items}
      onChange={handleTabChange}
    />
  );
}
