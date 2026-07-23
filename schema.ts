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
        name: z.string(),
      }),
    )
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
        physicalName: z.string(),
        logicalName: z.string(),
        overview: z.string(),
        unit: z.string(),
      }),
    )
    .optional(),
  notesText: z.string().optional(),

  keyInfoText: z.string().optional(),

  tableDefs: z.record(z.string(), z.array(tableDefRowSchema)).optional(),
});

export type MetadataFormData = z.infer<typeof metadataSchema>;
