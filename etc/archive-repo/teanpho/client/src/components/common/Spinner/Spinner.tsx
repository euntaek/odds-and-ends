import React from 'react';
import { css, keyframes } from '@emotion/react';

export interface SpinnerProps {
  className?: string;
  size?: 'small' | 'medium';
  color?: string;
}

function Spinner({ className, size = 'medium', color = '#FFF' }: SpinnerProps) {
  return (
    <div className={className} css={style(size, color)}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

const bounce = keyframes`
  0% {
    height: 2rem;
  }
  50%,
  100% {
    height: 1rem;
  } 
`;

const style = (size: 'small' | 'medium', color: string) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${size === 'medium' ? '2.25rem' : '1.125rem'};

  & span {
    display: inline-block;
    width: ${size === 'medium' ? '0.5rem' : '0.25rem'};
    border-radius: 0.125rem;
    background: ${color};
    animation: ${bounce} 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;

    &:nth-of-type(1) {
      animation-delay: -0.24s;
    }
    &:nth-of-type(2) {
      animation-delay: -0.12s;
    }
    &:nth-of-type(3) {
      animation-delay: 0;
    }
  }
`;

export default React.memo(Spinner);
