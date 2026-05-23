import apiClient from '../client/api-client';

export async function getLogs() {
  const response = await apiClient.get(
    '/logs'
  );

  return response.data;
}