import clinet from '../client';

export async function checkDuplicate(type: 'email' | 'username', value: string) {
  const response = await clinet.get<User>(`/api/v1/auth/check-duplicate/?${type}=${value}`);
  return response.data;
}
