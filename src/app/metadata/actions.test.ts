import { describe, expect, it } from "vitest";
import type { MetadataFormData } from "./_components/schema";
import { saveMetadataAction } from "./actions";

describe("saveMetadataAction", () => {
  it("should return success: true after simulating save", async () => {
    const mockData: MetadataFormData = {
      dataType: "clinical",
      overviewText: "Test",
      startYear: "2020",
      latestYear: "2024",
      collectionFrequency: "年次",
      updateFrequencies: [],
      tables: [],
      notesText: "",
      keyInfoText: "",
      tableDefs: {},
    };

    const result = await saveMetadataAction(mockData);
    expect(result).toEqual({ success: true });
  });
});
