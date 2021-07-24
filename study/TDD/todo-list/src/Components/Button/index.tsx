import styled from "styled-components";

interface ContainerProps {
  readonly bgColor?: string;
  readonly hoverColor?: string;
}

interface Props extends ContainerProps {
  readonly label: string;
  readonly onClick?: () => void;
}

export function Button({ label, bgColor = "#304ffe", hoverColor = "#1e40ff", onClick }: Props) {
  return (
    <Container bgColor={bgColor} hoverColor={hoverColor} onClick={onClick}>
      <Label>{label}</Label>
    </Container>
  );
}
// 특별한 기술은 필요치 않다.
const Container = styled.button<ContainerProps>`
  text-align: center;
  background-color: ${(props) => props.bgColor};
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.hoverColor};
  }
  &:active {
    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

const Label = styled.div`
  color: #ffffff;
  font-size: 16px;
`;
