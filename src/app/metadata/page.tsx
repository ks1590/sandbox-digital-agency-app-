import { fetchMetadata } from "./api";
import MetadataPageClient from "./MetadataPageClient";

export default async function MetadataPage() {
  const data = await fetchMetadata();

  return <MetadataPageClient data={data} />;
}
