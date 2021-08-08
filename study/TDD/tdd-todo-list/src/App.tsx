import styled from "styled-components";
import { PageHeader } from "Components";
import { List, Add } from "Pages";

function App() {
  return (
    <Container>
      <PageHeader />
      <Add />
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default App;
