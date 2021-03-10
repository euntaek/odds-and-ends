import React from 'react';
import { css } from '@emotion/react';
import { palette } from '@/lib/styles';
import Spinner from '@/components/common/Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'small' | 'medium';
  isLoading?: boolean;
}

function Button({
  children,
  size = 'medium',
  type = 'button',
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button type={type} css={style(isLoading)} disabled={isLoading} {...props}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
}

const style = (isLoading: boolean = false) => css`
  display: flex;
  position: relative;
  top: 0;
  width: 17rem;
  height: 3rem;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 0.25rem;
  background-color: ${palette.basic.black[0]};
  font-size: 1rem;
  font-weight: 700;
  color: ${palette.basic.white[0]};
  cursor: pointer;
  transition: top ease 200ms;

  &:hover {
    top: ${isLoading ? 0 : '-0.125rem'};
  }
  &:disabled {
    background-color: ${palette.basic.black[1]};
  }
`;

export default React.memo(Button);
