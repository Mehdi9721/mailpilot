import apiClient from '../client/api-client';

export async function getEmails() {
  const response = await apiClient.get(
    '/gmail/emails'
  );

  return response.data;
}

export async function getEmailById(
  id: string
) {
  const response = await apiClient.get(
    `/emails/${id}`
  );

  return response.data;
}

export async function syncEmails() {
  const response =
    await apiClient.post('/gmail/sync');

  return response.data;
}
