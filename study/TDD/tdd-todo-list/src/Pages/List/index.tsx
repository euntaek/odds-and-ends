import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Button } from "Components";

export function List() {
  const [todoList, setTodoList] = useState<string[]>([]);

  useEffect(() => {
    const list = localStorage.getItem("TodoList");
    if (list) setTodoList(JSON.parse(list));
  }, []);

  const onDelete = (todo: string) => {
    const list = todoList.filter((prevTodo) => prevTodo !== todo);
    setTodoList(list);
    localStorage.setItem("TodoList", JSON.stringify(list));
  };

  return (
    <Container>
      <TodoList>
        {todoList.map((todo, index) => (
          <TodoItem key={todo}>
            <Label to={`/detail/${index}`}>{todo}</Label>
            <Button
              label="삭제"
              backgroundColor="ff1744"
              hoverColor="f01440"
              onClick={() => onDelete(todo)}
            />
          </TodoItem>
        ))}
      </TodoList>
      <AddButton to="/add">추가</AddButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  border-color: #ffffff;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  align-items: center;
`;
const TodoItem = styled.li`
  display: flex;
  border-bottom: 1px solid #bdbdbd;
  align-items: center;
  margin: 10px;
  padding: 10px;
`;
const Label = styled(Link)`
  flex: 1;
  font-size: 16px;
  margin-right: 20px;
  text-decoration: none;
`;

const TodoList = styled.ul`
  min-width: 350px;
  height: 400px;
  overflow-y: scroll;
  border: 1px solid #bdbdbd;
  margin-bottom: 20px;
`;
const AddButton = styled(Link)`
  font-size: 20px;
  color: #ffffff;
  display: flex;
  align-items: center;
  width: 60px;
  height: 60px;
  justify-content: center;
  border-radius: 30px;
  cursor: pointer;
  position: absolute;
  bottom: -30px;
  background-color: #304ffe;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  &:hover {
    background-color: #1e40ff;
  }
  &:active {
    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;
