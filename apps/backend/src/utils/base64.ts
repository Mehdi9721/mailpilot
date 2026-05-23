export function decodeBase64(data: string) {
  if (!data) return '';

  return Buffer.from(data, 'base64').toString('utf-8');
}