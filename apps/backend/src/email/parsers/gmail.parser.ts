import { decodeBase64 } from '../../utils/base64';

export interface ParsedEmail {
  gmailMessageId: string;
  threadId: string;
  sender: string;
  subject: string;
  body: string;
  snippet: string;
  receivedAt: Date;
    headers: Record<string, string>;

}

function extractBody(payload: any): string {
  if (!payload) return '';

  if (payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  const parts = payload.parts || [];

  for (const part of parts) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      return decodeBase64(part.body.data);
    }

    if (part.mimeType === 'text/html' && part.body?.data) {
      return decodeBase64(part.body.data);
    }

    if (part.parts?.length) {
      const nested = extractBody(part);
      if (nested) return nested;
    }
  }

  return '';
}

export function parseGmailEmail(emailData: any): ParsedEmail {
  const headers = emailData.payload?.headers || [];

  const getHeader = (name: string) =>
    headers.find((h: any) => h.name === name)?.value || '';
  
  const headerMap: Record<string, string> = {};

  for (const h of headers) {
    headerMap[h.name.toLowerCase()] = h.value;
  }
  return {
    gmailMessageId: emailData.id,
    threadId: emailData.threadId,
    sender: getHeader('From'),
    subject: getHeader('Subject'),
    body: extractBody(emailData.payload),
    snippet: emailData.snippet || '',
    receivedAt: new Date(Number(emailData.internalDate)),
    headers: headerMap
  };
}