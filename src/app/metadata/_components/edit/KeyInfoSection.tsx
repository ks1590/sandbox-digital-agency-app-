"use client";

import { useFormContext } from "react-hook-form";
import type { MetadataFormData } from "../schema";
import { textareaClass } from "../styles";

/**
 * キー情報セクション
 */
export default function KeyInfoSection() {
  const { register } = useFormContext<MetadataFormData>();

  return (
    <section>
      <h3 className="text-xl font-bold mb-4">キー情報</h3>
      <label htmlFor="keyInfoText" className="sr-only">
        キー情報
      </label>
      <textarea
        id="keyInfoText"
        className={textareaClass}
        {...register("keyInfoText")}
      />
    </section>
  );
}
