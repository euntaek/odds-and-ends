import { css } from '@emotion/react';

const alignCenter = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`;

const hidden = css`
  overflow: hidden;
  border: 0;
  position: absolute;
  width: 1px;
  height: 1px;
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
`;

export const styleHelper = {
  alignCenter,
  hidden,
};
