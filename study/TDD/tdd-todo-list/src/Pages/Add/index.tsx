import { useState } from "react";
import { useHistory } from "react-router-dom";

import { Button } from "Components";
import styled from "styled-components";

export function Add() {
  const [todo, setTodo] = useState("");
  const { replace } = useHistory();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  const handleAddTodo = () => {
    if (todo === "") return;
    const todoList = JSON.parse(
      localStorage.getItem("TodoList") || "[]"
    ) as string[];
    localStorage.setItem("TodoList", JSON.stringify([...todoList, todo]));
    replace("/");
  };

  return (
    <Container>
      <Input placeholder="할 일을 입력해 주세요." onChange={onChange} />
      <Button label="추가" onClick={handleAddTodo} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
`;
const Input = styled.input`
  font-style: 16px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #bdbdbd;
  outline: none;
`;
