import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "jest-styled-components";

import { Button } from "./index";

describe("<Button/>", () => {
  test("redners component correctly", () => {
    const label = "추가";
    const { container } = render(<Button label={label} />);

    expect(screen.getByText(label)).toBeInTheDocument();

    const parent = screen.getByText(label).parentElement;
    expect(parent).toHaveStyleRule("background-color", "#304ffe");
    expect(parent).toHaveStyleRule("background-color", "#1e40ff", {
      modifier: ":hover",
    });
    expect(parent).toHaveStyleRule(
      "box-shadow",
      "inset 5px 5px 10px rgba(0,0,0,0.2)",
      {
        modifier: ":active",
      }
    );
    expect(container).toMatchSnapshot();
  });

  test("changes backgroundColor and hoverColor Props", () => {
    const backgroundColor = "#ff1744";
    const hoverColor = "#f0140";
    render(
      <Button
        label="추가"
        backgroundColor={backgroundColor}
        hoverColor={hoverColor}
      />
    );

    const parent = screen.getByText("추가").parentElement;
    expect(parent).toHaveStyleRule("background-color", backgroundColor);
    expect(parent).toHaveStyleRule("background-color", hoverColor, {
      modifier: ":hover",
    });
  });

  test("clicks the button", () => {
    const handleClick = jest.fn();
    render(<Button label="추가" onClick={handleClick} />);

    const label = screen.getByText("추가");
    expect(label).toBeInTheDocument();
    fireEvent.click(label);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
