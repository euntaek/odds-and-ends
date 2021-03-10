import React, { useMemo } from 'react';
import { css } from '@emotion/react';
import { styleHelper, palette } from '@/lib/styles';
import Spinner from '../Spinner';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  id: string;
  label: string;
  icon?: JSX.Element;
  isLoading?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

const msgFilter = (successMessage?: string, errorMessage?: string) => {
  if (!successMessage && !errorMessage) return {};
  if (errorMessage && successMessage) {
    throw new Error('There must be only one of both errorMessage and successMessage.');
  }
  return { success: !!successMessage, error: !successMessage, msg: successMessage || errorMessage };
};

function Input({
  className,
  id,
  label,
  icon,
  isLoading,
  successMessage,
  errorMessage,
  ...props
}: InputProps) {
  const { success, error, msg } = useMemo(() => msgFilter(successMessage, errorMessage), [
    successMessage,
    errorMessage,
  ]);

  return (
    <div className={className} css={style(props.disabled, success, error)}>
      <div className="input">
        {icon}
        <label htmlFor={id}>{label}</label>
        <input id={id} {...props} />
        {isLoading && <Spinner color={palette.basic.black[1]} size="small" className="spinner" />}
      </div>
      <div className="input-message">
        <p>{msg}</p>
      </div>
    </div>
  );
}

const style = (disabled: boolean = false, success?: boolean, error?: boolean) => css`
  .input {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: row;
    top: 0;
    width: 100%;
    height: 3rem;
    border: 0.125rem solid ${palette.basic.black[1]};
    border-radius: 0.25rem;
    transition: top ease 200ms;
    background-color: ${disabled ? palette.basic.black[3] : palette.basic.white[0]};
    ${error && `border: 0.125rem solid ${palette.accent.red[1]};`}
    ${success && `border: 0.125rem solid ${palette.accent.blue[1]};`}

    &:focus-within {
      position: relative;
      top: -0.125rem;
      border: 0.1875rem solid ${palette.basic.black[0]};
      ${error && `border: 0.1875rem solid ${palette.accent.red[1]};`}
      ${success && `border: 0.1875rem solid ${palette.accent.blue[1]};`}
    }

    label {
      ${styleHelper.hidden}
    }

    input {
      position: relative;
      flex-grow: 1;
      padding: 0;
      top: 0;
      height: 100%;
      border: none;
      outline: none;
      color: ${palette.basic.black[0]};
    }

    svg {
      margin: 0 1rem;
    }

    .spinner {
      margin: 0 1rem;
    }
  }

  .input-message {
    margin: 0.5rem 0;
    font-size: 0.75rem;
    color: ${success ? palette.accent.blue[0] : palette.accent.red[0]};
  }
`;

export default React.memo(Input);
