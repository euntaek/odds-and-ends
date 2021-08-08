import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Router, useLocation } from "react-router-dom";
import { createMemoryHistory } from "history";
import "jest-styled-components";

import { Add } from "./index";

afterEach(() => {
  localStorage.clear();
});

describe("<Add/>", () => {
  test("renders component correctly", () => {
    const history = createMemoryHistory();
    history.push("/add");

    const { container } = render(
      <Router history={history}>
        <Add />
      </Router>
    );

    const input = screen.getByPlaceholderText("할 일을 입력해 주세요.");
    expect(input).toBeInTheDocument();

    const button = screen.getByText("추가");
    expect(button).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test("add a new Todo and redircet to ther root page", () => {
    const history = createMemoryHistory();
    history.push("/add");

    const TestComponent = () => {
      const { pathname } = useLocation();
      return <div>{pathname}</div>;
    };

    render(
      <Router history={history}>
        <TestComponent />
        <Add />
      </Router>
    );

    const url = screen.getByText("/add");
    expect(url).toBeInTheDocument();

    const input = screen.getByPlaceholderText("할 일을 입력해 주세요.");
    expect(input).toBeInTheDocument();
    const button = screen.getByText("추가");
    expect(button).toBeInTheDocument();

    localStorage.setItem("TodoList", '["Old Todo"]');
    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(button);
    expect(localStorage.getItem("TodoList")).toBe('["Old Todo","New Todo"]');
    expect(url.textContent).toBe("/");
  });

  test("do nothing if the input is mepty", () => {
    localStorage.setItem("TodoList", '["Old Todo"]');

    const history = createMemoryHistory();
    history.push("/add");

    const TestComponent = () => {
      const { pathname } = useLocation();
      return <div>{pathname}</div>;
    };

    render(
      <Router history={history}>
        <TestComponent />
        <Add />
      </Router>
    );

    const url = screen.getByText("/add");
    expect(url).toBeInTheDocument();

    const button = screen.getByText("추가");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    expect(localStorage.getItem("TodoList")).toBe('["Old Todo"]');
    expect(url.textContent).toBe("/add");
  });
});
