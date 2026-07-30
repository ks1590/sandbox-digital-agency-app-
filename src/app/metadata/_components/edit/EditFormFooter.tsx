"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface EditFormFooterProps {
  onCancel: () => void;
  returnHref?: string | null;
  returnText?: string | null;
}

export default function EditFormFooter({
  onCancel,
  returnHref,
  returnText,
}: EditFormFooterProps) {
  return (
    <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6">
      <div className="w-full sm:w-auto">
        {returnHref && returnText ? (
          <Button
            variant="outline"
            size="md"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href={returnHref}>{returnText}</Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="solid-fill"
          size="md"
          className="w-full sm:w-auto"
        >
          仮登録
        </Button>
      </div>
    </div>
  );
}
