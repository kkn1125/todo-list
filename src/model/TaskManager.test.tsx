import RecoilUpdate from "@component/test/RecoilUpdate";
import { fireEvent, render, screen } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import { describe, expect, it, vitest } from "vitest";

describe("task manager test", () => {
  it("task manager initialize", () => {
    const onChange = vitest.fn();

    render(
      <RecoilRoot>
        <RecoilUpdate />
      </RecoilRoot>
    );

    const component = screen.getByTestId("name_input");

    fireEvent.change(component, { target: { value: "Recoil" } });

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith(""); // Initial state on render.
    expect(onChange).toHaveBeenCalledWith("Recoil"); // New value on change.
  });
});
