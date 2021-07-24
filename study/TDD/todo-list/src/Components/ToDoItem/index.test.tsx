import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "jest-styled-components";

import { ToDoItem } from "./index";

describe("<ToDoItem />", () => {
  test("renders component correctly", () => {
    const { container, getByText } = render(<ToDoItem label="default value" />);
    expect(getByText("default value")).toBeInTheDocument();
    expect(getByText("삭제")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("clicks the delete button", () => {
    const handleClick = jest.fn();
    const { getByText } = render(<ToDoItem label="default value" onDelete={handleClick} />);
    const deleteButton = getByText("삭제");
    expect(deleteButton).toBeInTheDocument();
    expect(handleClick).toBeCalledTimes(0);
    fireEvent.click(deleteButton);
    expect(handleClick).toBeCalledTimes(1);
  });
});
