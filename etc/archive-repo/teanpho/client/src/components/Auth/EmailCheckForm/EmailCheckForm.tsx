import React, { useCallback } from 'react';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Icon from '@/components/common/Icon';
import { validateEmail } from '@/lib/utils';

function EmailCheckForm() {
  const { register, errors, setError, handleSubmit, watch } = useForm<{ email: string }>();
  const router = useRouter();

  const onSubmit = async ({ email }: { email: string }) => {
    if (!validateEmail(email)) {
      return setError('email', { message: '잘못된 이메일 형식입니다.' });
    }
    console.log(email);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} css={style}>
      <Input
        label="email"
        type="email"
        className="input-container"
        placeholder="이메일을 입력해주세요."
        autoComplete="email"
        register={register}
        icon={<Icon name="mail" />}
        errorMessage={errors.email?.message}
      />
      <Button type="submit">이메일로 시작하기</Button>
    </form>
  );
}

const style = css`
  .input-container {
    margin-bottom: 16px;
  }
`;

export default EmailCheckForm;
