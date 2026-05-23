import apiClient from '../client/api-client';

export async function generateDraft(
  emailId: string
) {
  const response = await apiClient.post(
    `/drafts/${emailId}`
  );

  return response.data;
}