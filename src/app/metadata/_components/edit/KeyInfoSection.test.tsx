import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import KeyInfoSection from "./KeyInfoSection";

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: {
      keyInfoText: "Default Key Info",
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("KeyInfoSection", () => {
  it("正しくレンダリングされる", () => {
    render(
      <Wrapper>
        <KeyInfoSection />
      </Wrapper>,
    );

    expect(screen.getAllByText("キー情報").length).toBeGreaterThan(0);

    const textarea = screen.getByRole("textbox", { name: "キー情報" });
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Default Key Info");
  });
});
