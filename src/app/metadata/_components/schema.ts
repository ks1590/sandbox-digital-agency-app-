import { z } from "zod";

export const tableDefRowSchema = z.object({
  id: z.number(),
  physicalName: z.string(),
  dataType: z.string(),
  length: z.union([z.number(), z.string()]),
  required: z.string(),
  logicalName: z.string(),
  description: z.string(),
  foreignKey: z.string(),
  masterType: z.string(),
  sampleData: z.string(),
});

export type TableDefRowFormData = z.infer<typeof tableDefRowSchema>;

export const metadataSchema = z.object({
  // Overview Tab
  dataType: z.string().optional(),
  overviewText: z.string().optional(),
  dataTypes: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().trim().min(1, {
          message: "データ種別名を入力してください",
        }),
      }),
    )
    .superRefine((items, ctx) => {
      const names = new Set<string>();
      items.forEach((item, index) => {
        const trimmed = item.name.trim();
        if (!trimmed) return;
        if (names.has(trimmed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "同じデータ種別名は登録できません",
            path: [index, "name"],
          });
        } else {
          names.add(trimmed);
        }
      });
    })
    .optional(),
  startYear: z.string().optional(),
  latestYear: z.string().optional(),
  collectionFrequency: z.string().optional(),
  updateFrequencies: z
    .array(
      z.object({
        target: z.string(),
        frequency: z.string(),
      }),
    )
    .optional(),
  tables: z
    .array(
      z.object({
        id: z.string(),
        physicalName: z.string().trim().min(1, {
          message: "テーブル物理名を選択してください",
        }),
        logicalName: z.string().trim().min(1, {
          message: "テーブル論理名を入力してください",
        }),
        overview: z.string(),
        unit: z.string(),
      }),
    )
    .superRefine((items, ctx) => {
      const nameIndicesMap = new Map<string, number[]>();
      items.forEach((item, index) => {
        const trimmed = item.logicalName.trim();
        if (!trimmed) return;
        if (!nameIndicesMap.has(trimmed)) {
          nameIndicesMap.set(trimmed, []);
        }
        nameIndicesMap.get(trimmed)!.push(index);
      });

      nameIndicesMap.forEach((indices) => {
        if (indices.length > 1) {
          indices.forEach((index) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "テーブル論理名が重複しています",
              path: [index, "logicalName"],
            });
          });
        }
      });
    })
    .optional(),
  notesText: z.string().optional(),

  keyInfoText: z.string().optional(),

  tableDefs: z.record(z.string(), z.array(tableDefRowSchema)).optional(),
});

export type MetadataFormData = z.infer<typeof metadataSchema>;
