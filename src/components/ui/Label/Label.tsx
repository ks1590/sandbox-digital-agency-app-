import type { ComponentProps } from "react";

export type LabelSize = "lg" | "md" | "sm";

export type LabelProps = ComponentProps<"label"> & {
  size?: LabelSize;
};

export const Label = (props: LabelProps) => {
  const { children, className, size = "md", ...rest } = props;

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: 汎用的なラッパーコンポーネントであり、コントロールとの関連付けは利用側で行うため
    <label
      className={`
        text-solid-gray-800
        data-[size=sm]:text-std-16B-170 data-[size=md]:text-std-17B-170 data-[size=lg]:text-std-18B-160
        ${className ?? ""}
      `}
      data-size={size}
      {...rest}
    >
      {children}
    </label>
  );
};
