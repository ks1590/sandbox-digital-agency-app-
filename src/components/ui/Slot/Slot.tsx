import {
  Children,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

type SlotProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
};

export const Slot = (props: SlotProps) => {
  const { children, ...rest } = props;

  if (isValidElement(children)) {
    const childProps = (children as ReactElement).props as Record<string, unknown>;
    return cloneElement(children as ReactElement<any>, {
      ...rest,
      ...childProps,
      className: `${rest.className ?? ""} ${
        typeof childProps.className === "string" ? childProps.className : ""
      }`.trim(),
    });
  }

  if (Children.count(children) > 1) {
    Children.only(null);
  }

  return null;
};
