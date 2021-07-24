import styled from "styled-components";

interface Props {
  readonly placeholder: string;
  readonly value?: string;
  readonly onChange?: (text: string) => void;
}

export function Input({ placeholder, value, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };
  return <InputBox placeholder={placeholder} value={value} onChange={handleChange} />;
}

const InputBox = styled.input`
  flex: 1;
  font-size: 16px;
  padding: 10px 10px;
  border-radius: 8px;
  border: 1px solid #bdbdbd;
  outline: none;
`;
