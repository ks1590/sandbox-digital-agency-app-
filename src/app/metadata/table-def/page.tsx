import { cookies } from "next/headers";
import Link from "next/link";
import Header from "../../../components/layout/Header";
import MetadataViewTabs from "../_components/MetadataViewTabs";
import SortableTable from "../../../components/ui/SortableTable";
import type { Column, RowData } from "../../../components/ui/SortableTable";
import { TableDefGrid } from "../_components/TableDefContent";

const tableColumns: Column[] = [
  { key: "no", label: "項番" },
  { key: "logicalName", label: "論理名" },
  { key: "physicalName", label: "物理名" },
  { key: "dataType", label: "データ型" },
  { key: "required", label: "必須/任意" },
  { key: "sample", label: "サンプルデータ" },
];

const diseaseData: RowData[] = [
  {
    no: 1,
    logicalName: "患者ID",
    physicalName: "patient_id",
    dataType: "VARCHAR(255)",
    required: "必須",
    sample: "P0000001",
  },
  {
    no: 2,
    logicalName: "傷病名",
    physicalName: "disease_name",
    dataType: "VARCHAR(255)",
    required: "必須",
    sample: "インフルエンザ",
  },
  {
    no: 3,
    logicalName: "診断日",
    physicalName: "diagnosis_date",
    dataType: "DATE",
    required: "任意",
    sample: "2023-01-15",
  },
  {
    no: 4,
    logicalName: "転帰",
    physicalName: "outcome",
    dataType: "VARCHAR(50)",
    required: "任意",
    sample: "治癒",
  },
];

const allergyData: RowData[] = [
  {
    no: 1,
    logicalName: "患者ID",
    physicalName: "patient_id",
    dataType: "VARCHAR(255)",
    required: "必須",
    sample: "P0000001",
  },
  {
    no: 2,
    logicalName: "アレルゲン",
    physicalName: "allergen",
    dataType: "VARCHAR(255)",
    required: "必須",
    sample: "ペニシリン",
  },
  {
    no: 3,
    logicalName: "重症度",
    physicalName: "severity",
    dataType: "VARCHAR(50)",
    required: "任意",
    sample: "重度",
  },
  {
    no: 4,
    logicalName: "発現日",
    physicalName: "onset_date",
    dataType: "DATE",
    required: "任意",
    sample: "2010-05-10",
  },
];

const examData: RowData[] = [
  {
    no: 1,
    logicalName: "患者ID",
    physicalName: "patient_id",
    dataType: "VARCHAR(255)",
    required: "必須",
    sample: "P0000001",
  },
  {
    no: 2,
    logicalName: "検査日",
    physicalName: "exam_date",
    dataType: "DATE",
    required: "必須",
    sample: "2023-10-01",
  },
  {
    no: 3,
    logicalName: "検査項目",
    physicalName: "exam_item",
    dataType: "VARCHAR(255)",
    required: "必須",
    sample: "HbA1c",
  },
  {
    no: 4,
    logicalName: "検査値",
    physicalName: "exam_value",
    dataType: "DECIMAL(10,2)",
    required: "任意",
    sample: "5.8",
  },
  {
    no: 5,
    logicalName: "単位",
    physicalName: "unit",
    dataType: "VARCHAR(50)",
    required: "任意",
    sample: "%",
  },
];

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TableDefPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("login-user-id")?.value;

  const params = await searchParams;
  const tabParam = typeof params.tab === "string" ? params.tab : "disease";
  const isEditMode = params.mode === "edit";

  let defaultIndex = 0;
  if (tabParam === "allergy") defaultIndex = 1;
  else if (tabParam === "examination") defaultIndex = 2;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header userId={userId} />

      <main className="page-bg flex-1">
        <div className="page-container">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              テーブル定義詳細
            </h2>
            {!isEditMode && (
              <Link
                href={`/metadata?mode=edit&tab=table-def&subtab=${tabParam}`}
                className="inline-flex items-center justify-center min-w-[120px] min-h-[44px] rounded-[8px] bg-white border-2 border-[#0017C1] px-4 py-2 text-base font-bold text-[#0017C1] transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:ring-[2px] focus-visible:ring-yellow-300"
              >
                編集
              </Link>
            )}
          </div>

          <hr className="border-t-[3px] border-[#0017C1] mb-8" />

          <div className="mb-12">
            <MetadataViewTabs
              headingId="table-def-tabs-heading"
              defaultIndex={defaultIndex}
              tabMap={["disease", "allergy", "examination"]}
              items={[
                {
                  label: "傷病",
                  id: "tab-disease",
                  content: (
                    <div className="py-6">
                      {isEditMode ? (
                        <TableDefGrid />
                      ) : (
                        <SortableTable
                          columns={tableColumns}
                          data={diseaseData}
                          sortable={false}
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: "アレルギー",
                  id: "tab-allergy",
                  content: (
                    <div className="py-6">
                      {isEditMode ? (
                        <TableDefGrid />
                      ) : (
                        <SortableTable
                          columns={tableColumns}
                          data={allergyData}
                          sortable={false}
                        />
                      )}
                    </div>
                  ),
                },
                {
                  label: "検査",
                  id: "tab-examination",
                  content: (
                    <div className="py-6">
                      {isEditMode ? (
                        <TableDefGrid />
                      ) : (
                        <SortableTable
                          columns={tableColumns}
                          data={examData}
                          sortable={false}
                        />
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>

          {isEditMode ? (
            <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-300">
              <Link
                href="/metadata?mode=edit&tab=table-def"
                className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300 w-full sm:w-auto"
              >
                キャンセル
              </Link>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] bg-[#0017C1] px-4 py-3 text-base font-bold text-white underline-offset-[3px] transition-colors hover:bg-[#1A30C9] hover:underline active:bg-[#001299] active:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300"
                >
                  更新
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <Link
                href="/metadata?tab=table-def"
                className="inline-flex items-center justify-center min-w-[136px] min-h-[56px] rounded-[8px] border border-gray-400 bg-white px-4 py-3 text-base font-bold text-gray-900 underline-offset-[3px] transition-colors hover:bg-gray-50 hover:underline active:bg-gray-100 active:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[2px] focus-visible:ring-[2px] focus-visible:ring-yellow-300"
              >
                戻る
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
