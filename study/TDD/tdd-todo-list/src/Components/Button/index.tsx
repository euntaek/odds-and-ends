import styled from "styled-components";

interface ContainerProps {
  readonly backgroundColor?: string;
  readonly hoverColor?: string;
  readonly onClick?: () => void;
}
interface Props extends ContainerProps {
  readonly label: string;
}

export function Button({ label, ...containerProps }: Props) {
  return (
    <Container {...containerProps}>
      <Label>{label}</Label>
    </Container>
  );
}

const Container = styled.div<ContainerProps>`
  text-align: center;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ backgroundColor = "#304ffe" }) => backgroundColor};
  &:hover {
    background-color: ${({ hoverColor = "#1e40ff" }) => hoverColor};
  }
  &:active {
    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;
const Label = styled.div`
  color: #ffffff;
  font-size: 16px;
`;
