"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Tab from "../../../components/ui/Tab";
import type { TabItem } from "../../../components/ui/Tab/Tab";

interface Props {
  items: TabItem[];
  headingId: string;
  defaultIndex: number;
  tabMap?: string[];
}

export default function MetadataViewTabs({
  items,
  headingId,
  defaultIndex,
  tabMap = ["overview", "er", "table-def"],
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = (index: number) => {
    const newTab = tabMap[index] || tabMap[0];

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
