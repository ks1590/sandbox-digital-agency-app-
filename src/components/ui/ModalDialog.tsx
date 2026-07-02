import React, { forwardRef } from "react";

export const ModalDialog = forwardRef<
  HTMLDialogElement,
  React.ComponentProps<"dialog">
>(({ children, className = "", onClick, ...props }, ref) => {
  return (
    <dialog
      ref={ref}
      className={`bg-transparent p-0 backdrop:bg-black/50 overflow-visible ${className}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.close();
        }
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </dialog>
  );
});
ModalDialog.displayName = "ModalDialog";

export const ModalDialogContent = ({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-xl w-full max-w-md mx-auto flex flex-col overflow-hidden ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
};

export const ModalDialogHeader = ({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={`px-6 py-5 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const ModalDialogHeading = forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h2">
>(({ children, className = "", ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={`text-xl font-bold text-gray-900 m-0 ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
});
ModalDialogHeading.displayName = "ModalDialogHeading";

export const ModalDialogBody = ({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={`px-6 py-6 text-gray-700 whitespace-pre-wrap ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const ModalDialogActions = ({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
