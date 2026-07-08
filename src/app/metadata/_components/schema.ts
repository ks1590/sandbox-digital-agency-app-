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
        name: z.string(),
        overview: z.string(),
        unit: z.string(),
      }),
    )
    .optional(),
  notesText: z.string().optional(),

  // Key Info Section
  keyInfoText: z.string().optional(),

  // Table Def Tab (disease, allergy, examination)
  tableDefs: z
    .object({
      disease: z.array(tableDefRowSchema).optional(),
      allergy: z.array(tableDefRowSchema).optional(),
      examination: z.array(tableDefRowSchema).optional(),
    })
    .optional(),
});

export type MetadataFormData = z.infer<typeof metadataSchema>;
