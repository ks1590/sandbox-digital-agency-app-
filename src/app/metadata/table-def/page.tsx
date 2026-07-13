import { fetchMetadata } from "../api";
import TableDefPageClient from "./TableDefPageClient";

export default async function TableDefPage() {
  const data = await fetchMetadata();

  return <TableDefPageClient data={data} />;
}
