import React from "react";
import { render, fireEvent } from "@testing-library/react";

import App from "./App";

describe("<App/>", () => {
  test("renders component correctly", () => {
    const { container, getByTestId, getByText, getByPlaceholderText } = render(<App />);

    const toDoList = getByTestId("toDoList");
    expect(toDoList).toBeInTheDocument();
    expect(toDoList.firstChild).toBeNull();

    const input = getByPlaceholderText("할 일을 입력해 주세요");
    expect(input).toBeInTheDocument();
    const label = getByText("추가");
    expect(label).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test("adds and deletes toDo items", () => {
    const { getByText, getAllByText, getByPlaceholderText, getByTestId } = render(<App />);
    const input = getByPlaceholderText("할 일을 입력해 주세요");
    const button = getByText("추가");
    fireEvent.change(input, { target: { value: "study react 1" } });
    fireEvent.click(button);

    const toDoItem = getByText("study react 1");
    expect(toDoItem).toBeInTheDocument();
    const deletebutton = getByText("삭제");
    expect(deletebutton).toBeInTheDocument();

    const toDoList = getByTestId("toDoList");
    expect(toDoList.childElementCount).toBe(1);

    fireEvent.change(input, { target: { value: "study react 2" } });
    fireEvent.click(button);

    const toDoItem2 = getByText("study react 2");
    expect(toDoItem2).toBeInTheDocument();
    expect(toDoList.childElementCount).toBe(2);

    const deleteButtons = getAllByText("삭제");
    expect(deleteButtons).toHaveLength(2);

    fireEvent.click(deleteButtons[0]);
    expect(toDoItem).not.toBeInTheDocument();
    expect(toDoList.childElementCount).toBe(1);
  });

  test("does not add empty ToDo", () => {
    const { getByTestId, getByText } = render(<App />);

    const toDoList = getByTestId("toDoList");
    expect(toDoList).toBeInTheDocument();
    const button = getByText("추가");
    expect(button).toBeInTheDocument();

    const length = toDoList.childElementCount;
    fireEvent.click(button);

    expect(toDoList.childElementCount).toBe(length);
  });
});
