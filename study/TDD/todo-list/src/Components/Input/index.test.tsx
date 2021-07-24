import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "jest-styled-components";

import { Input } from "./index";

describe("<Input />", () => {
  it("renders component correctly", () => {
    const { container } = render(<Input value="default value" placeholder="input test" />);
    const input = screen.getByDisplayValue("default value");
    expect(input).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders placeholder correctly", () => {
    render(<Input placeholder="default placeholder" />);
    const input = screen.getByPlaceholderText("default placeholder");
    expect(input).toBeInTheDocument();
  });

  it("changes the data", () => {
    const handleChange = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="default placeholder" onChange={handleChange} />,
    );
    const input = getByPlaceholderText("default placeholder");
    expect(input).toBeInTheDocument();
    expect(handleChange).toBeCalledTimes(0);
    fireEvent.change(input, { target: { value: "study react" } });
    expect(handleChange).toBeCalledTimes(1);
  });
});
