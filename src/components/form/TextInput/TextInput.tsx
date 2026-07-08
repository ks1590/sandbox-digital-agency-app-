import React, { forwardRef, useId } from "react";
import { Input, type InputProps } from "@/components/form/Input";
import { ErrorText } from "@/components/ui/ErrorText";
import { Label } from "@/components/ui/Label";
import { RequirementBadge } from "@/components/ui/RequirementBadge";
import { SupportText } from "@/components/ui/SupportText";

export type TextInputProps = InputProps & {
  label: string;
  supportText?: string;
  errorText?: string;
  isOptional?: boolean; // falseの場合は「※必須」、trueの場合は「※任意」を表示（必要に応じて）
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const {
      label,
      required,
      supportText,
      errorText,
      isError,
      id,
      isOptional,
      ...rest
    } = props;

    const generatedId = useId();
    const inputId = id ?? generatedId;
    const supportTextId = `${inputId}-support`;
    const errorTextId = `${inputId}-error`;

    const hasError = isError || !!errorText;
    const describedBy =
      [
        hasError && errorText ? errorTextId : null,
        supportText ? supportTextId : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className="flex flex-col items-start gap-2">
        <Label htmlFor={inputId}>
          {label}
          {required && !isOptional && (
            <RequirementBadge>※必須</RequirementBadge>
          )}
          {isOptional && <RequirementBadge isOptional>※任意</RequirementBadge>}
        </Label>
        {supportText && (
          <SupportText id={supportTextId}>{supportText}</SupportText>
        )}
        <Input
          aria-describedby={describedBy}
          id={inputId}
          ref={ref}
          isError={hasError}
          required={required}
          className="w-full"
          {...rest}
        />
        {hasError && errorText && (
          <ErrorText id={errorTextId}>{errorText}</ErrorText>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
