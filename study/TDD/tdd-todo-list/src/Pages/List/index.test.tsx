import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Router, useLocation } from "react-router-dom";
import { createMemoryHistory } from "history";
import "jest-styled-components";

import { List } from "./index";

beforeEach(() => {
  localStorage.setItem("TodoList", '["Todo 1", "Todo 2", "Todo 3"]');
});

afterEach(() => {
  localStorage.clear();
});

describe("<List/>", () => {
  test("renders component correctly", () => {
    const history = createMemoryHistory();
    history.push("/");

    const { container } = render(
      <Router history={history}>
        <List />
      </Router>
    );

    const todoItem1 = screen.getByText("Todo 1");
    expect(todoItem1).toBeInTheDocument();
    const todoItem2 = screen.getByText("Todo 2");
    expect(todoItem2).toBeInTheDocument();
    const todoItem3 = screen.getByText("Todo 3");
    expect(todoItem3).toBeInTheDocument();

    expect(screen.getAllByText("삭제").length).toBe(3);

    const addButton = screen.getByText("추가");
    expect(addButton).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test("deletes todo item", () => {
    const history = createMemoryHistory();
    history.push("/");

    render(
      <Router history={history}>
        <List />
      </Router>
    );

    const todoItem = screen.getByText("Todo 2");
    expect(todoItem).toBeInTheDocument();
    fireEvent.click(todoItem.nextElementSibling as HTMLElement);
    expect(
      JSON.parse(localStorage.getItem("TodoList") as string)
    ).not.toContain("Todo 2");
  });

  test("moves to detail page", () => {
    const history = createMemoryHistory();
    history.push("/");

    const TestComponent = () => {
      const { pathname } = useLocation();
      return <div>{pathname}</div>;
    };

    render(
      <Router history={history}>
        <TestComponent />
        <List />
      </Router>
    );

    const url = screen.getByText("/");
    expect(url).toBeInTheDocument();

    const todoItem1 = screen.getByText("Todo 2");
    expect(todoItem1.getAttribute("href")).toBe("/detail/1");

    fireEvent.click(todoItem1);
    expect(url.textContent).toBe("/detail/1");
  });

  test("move to add page", () => {
    const history = createMemoryHistory();
    history.push("/");

    const TestComponent = () => {
      const { pathname } = useLocation();
      return <div>{pathname}</div>;
    };

    render(
      <Router history={history}>
        <TestComponent />
        <List />
      </Router>
    );

    const url = screen.getByText("/");
    expect(url).toBeInTheDocument();

    const addButton = screen.getByText("추가");
    expect(addButton).toBeInTheDocument();
    expect(addButton.getAttribute("href")).toBe("/add");

    fireEvent.click(addButton);
    expect(url.textContent).toBe("/add");
  });
});
