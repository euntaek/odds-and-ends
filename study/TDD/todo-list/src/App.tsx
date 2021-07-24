import { useState } from "react";
import styled from "styled-components";

import { Button, Input, ToDoItem } from "Components";

function App() {
  const [toDo, setToDo] = useState("");
  const [toDoList, setToDoList] = useState<string[]>([]);

  const addToDo = () => {
    if (toDo) {
      setToDoList((toDoList) => [...toDoList, toDo]);
      setToDo("");
    }
  };

  const deleteToDo = (index: number) => {
    setToDoList((toDoList) => toDoList.filter((toDo, idx) => idx !== index));
  };

  return (
    <Container>
      <Contents>
        <ToDoListContainer data-testid="toDoList">
          {toDoList.map((toDo, index) => (
            <ToDoItem key={toDo} label={toDo} onDelete={() => deleteToDo(index)} />
          ))}
        </ToDoListContainer>
        <InputContainer>
          <Input
            placeholder="할 일을 입력해 주세요"
            value={toDo}
            onChange={(text) => {
              setToDo(text);
            }}
          />
          <Button label="추가" onClick={addToDo} />
        </InputContainer>
      </Contents>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Contents = styled.div`
  display: flex;
  background-color: #ffffff;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
`;

const InputContainer = styled.div`
  display: flex;
`;

const ToDoListContainer = styled.div`
  min-width: 350px;
  height: 400px;
  overflow-y: scroll;
  border: 1px solid #bdbdbd;
  margin-bottom: 20px;
`;

export default App;
